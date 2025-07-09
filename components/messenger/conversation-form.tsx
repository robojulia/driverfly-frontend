/**
 * ConversationForm Component - Simplified and Clean Implementation
 *
 * This is a complete rewrite focused on simplicity and avoiding infinite loops.
 * Key principles:
 * - Minimal state management
 * - Clear separation of concerns
 * - No complex memoization that causes dependency issues
 * - Simple, predictable data flow
 */

import axios, { CancelTokenSource } from 'axios';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ApplicantDocumentType } from '../../enums/applicants/applicant-document-type.enum';
import { UserPreferenceCommunicationLabel } from '../../enums/users/user-preferences-communication-label.enum';
import useStorage from '../../hooks/use-storage';
import { useTranslation } from '../../hooks/use-translation';
import { useAuth } from '../../hooks/use-auth';
import { ApplicantEntity } from '../../models/applicant';
import { CompanyPhoneNumberEntity } from '../../models/company/company-phone-number.entity';
import {
  ConversationEntity,
  CreateConversationDto,
} from '../../models/conversation/conversation.entity';
import { UserPreferenceEntity } from '../../models/user/user-preference.entity';
import { ConversationApi } from '../../pages/api/conversation';
import CompanyApi from '../../pages/api/company';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import { buildArrayQueryString } from '../../utils/common';
import ComboBox, { ComboboxItem } from '../controls/combobox';
import BaseTextArea from '../forms/base-text-area';
import { LoaderIcon } from '../loading/loader-icon';
import { Message } from './message';

export interface ConversationFormProps {
  entity?: ConversationEntity;
  userPreferences?: UserPreferenceEntity[];
  canCreate?: boolean;
  onCreated?: (e: ConversationEntity) => void;
  onUpdated?: (e: ConversationEntity) => void;
  onConversationToChange?: (e: CreateConversationDto) => void;
  getOptions?: (query: string, cancellationToken: CancelTokenSource) => Promise<ComboboxItem[]>;
  applicant?: ApplicantEntity;
}

// Utility functions outside component
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

const PreferredHours: React.FC<{ userPreferences?: UserPreferenceEntity[] }> = ({
  userPreferences,
}) => {
  const { t } = useTranslation();
  const hours = userPreferences?.find(
    (v) => v.label === UserPreferenceCommunicationLabel.PREFERRED_HOURS
  )?.value;
  return hours ? <>{`${hours?.start}-${hours?.end}`}</> : <>{t('NOT_SPECIFIED')}</>;
};

export function ConversationForm(props: ConversationFormProps) {
  const {
    entity,
    canCreate = false,
    onCreated,
    onUpdated,
    onConversationToChange,
    getOptions,
    userPreferences = [],
    applicant,
  } = props;

  const { t } = useTranslation();
  const { user } = useAuth();
  const { getItem: getDraft, setItem: setDraft, removeItem: removeDraft } = useStorage();

  // Simple state - no complex memoization
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);
  const [documentTypes] = useState<ApplicantDocumentType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [companyPhoneNumbers, setCompanyPhoneNumbers] = useState<CompanyPhoneNumberEntity[]>([]);
  const [phoneNumbersLoading, setPhoneNumbersLoading] = useState(true);
  const [phoneNumbersError, setPhoneNumbersError] = useState<string | null>(null);

  const lastMessageRef = useRef<HTMLLIElement>(null);
  const api = new ConversationApi();
  const companyApi = new CompanyApi();

  // Simple draft key generation
  const getDraftKey = () => {
    if (!entity || !user?.id) return '';
    return `draft_user_${user.id}_${entity.chattable_type}_${entity.chattable_id}`;
  };

  // Generate document request message if needed
  const generateDocumentMessage = () => {
    if (documentTypes.length === 0 || !applicant?.uuid_token) return '';

    const link = `${process.env.FRONTEND_BASE_URL}form/applicant/${
      applicant.uuid_token
    }/documents?${buildArrayQueryString('type', documentTypes)}`;

    const documents = documentTypes
      .map((type) => t(`ApplicantDocumentType.${type}`))
      .reduce((acc, curr, index, array) => {
        if (index === 0) return curr;
        if (index === array.length - 1) return `${acc} and ${curr}`;
        return `${acc}, ${curr}`;
      }, '');

    return t(
      'REQUEST_{name}_FOR_MISSING_{documents}_MESSAGE_WITH_{link}_{hv}',
      {
        name: `${applicant?.first_name ?? ''} ${applicant?.last_name ?? ''}`,
        documents,
        link,
        hv: documentTypes.length === 1 ? 'IS' : 'ARE',
      },
      { translateProps: true }
    );
  };

  const form = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      chattable_id: entity?.chattable_id || '',
      chattable_name: entity?.chattable_name || '',
      chattable_type: entity?.chattable_type || '',
      message: '',
    },
    validationSchema: ConversationEntity.CreateDto.yupSchema(),
    onSubmit: async (values) => {
      // Check if company has provisioned phone numbers
      if (!phoneNumbersLoading && companyPhoneNumbers.length === 0) {
        toast.error(t('NO_PHONE_NUMBER_PROVISIONED_CONTACT_SUPPORT'));
        return;
      }

      if (!values.message?.trim()) {
        toast.error(t('MESSAGE_CANNOT_BE_EMPTY'));
        return;
      }

      try {
        let conversation = entity;

        // Create conversation if needed
        if (!conversation?.id) {
          if (!values.chattable_id || !values.chattable_type) {
            toast.error(t('PLEASE_SELECT_A_RECIPIENT'));
            return;
          }

          conversation = await api.create({
            chattable_type: values.chattable_type as any,
            chattable_name: values.chattable_name,
            chattable_id: Number(values.chattable_id),
          });

          conversation.messages = await api.messages.list(conversation.id);
        }

        // Send message
        const newMessage = await api.messages.create(conversation.id, {
          text: values.message.trim(),
        });

        // Update conversation
        const updatedConversation = {
          ...conversation,
          lastMessage: newMessage,
          messages: [...(conversation.messages || []), newMessage],
        };

        // Clear form and draft
        form.setFieldValue('message', '');
        removeDraft(getDraftKey());

        // Notify parent
        if (entity?.id) {
          onUpdated?.(updatedConversation);
        } else {
          onCreated?.(updatedConversation);
        }

        toast.success(t('MESSAGE_SENT_SUCCESSFULLY'));
      } catch (error) {
        console.error('Error sending message:', error);
        globalAjaxExceptionHandler(error, { formik: form, t, toast });
      }
    },
  });
  // Initialize form when entity changes
  useEffect(() => {
    if (entity) {
      const draftValue = getDraft(getDraftKey());
      const documentMessage = generateDocumentMessage();

      const newValues = {
        chattable_id: entity.chattable_id || '',
        chattable_name: entity.chattable_name || '',
        chattable_type: entity.chattable_type || '',
        message: documentMessage || draftValue || '',
      };

      form.setValues(newValues);
      setIsInitialized(true);
    } else {
      // Reset when no entity
      form.resetForm();
      setIsInitialized(false);
    }
  }, [entity?.id, entity?.chattable_id, entity?.chattable_type]); // Depend on key entity properties

  // Fetch company phone numbers on mount
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      if (!user?.company?.id) {
        setPhoneNumbersError('No company associated with user');
        setPhoneNumbersLoading(false);
        return;
      }

      try {
        setPhoneNumbersLoading(true);
        setPhoneNumbersError(null);
        const phoneNumbers = await companyApi.phoneNumbers.list(user.company.id);
        setCompanyPhoneNumbers(phoneNumbers);
      } catch (error) {
        console.error('Error fetching company phone numbers:', error);
        setPhoneNumbersError('Failed to load phone numbers');
        setCompanyPhoneNumbers([]);
      } finally {
        setPhoneNumbersLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, [user?.company?.id]);

  // Handle draft saving
  const handleMessageChange = useCallback((value: string) => {
    form.setFieldValue('message', value);
    setDraft(getDraftKey(), value);
  }, []);

  // Handle conversation selection
  const handleConversationChange = useCallback((e: any) => {
    const { value } = e.target;
    const values = {
      chattable_type: value?.chattable_type || '',
      chattable_id: value?.chattable_id || '',
      chattable_name: value?.chattable_name || '',
      message: getDraft(getDraftKey()) || '',
    };

    form.setValues(values);
    onConversationToChange?.(values);
  }, []);

  // Handle search with cancellation
  const handleSearch = useCallback(
    async (query: string) => {
      if (!getOptions) return [];

      // Cancel previous request
      if (cancelTokenSource) {
        cancelTokenSource.cancel('New search');
      }

      const tokenSource = axios.CancelToken.source();
      setCancelTokenSource(tokenSource);

      try {
        return await getOptions(query, tokenSource);
      } catch (error) {
        if (axios.isCancel(error)) {
          return [];
        }
        throw error;
      }
    },
    [getOptions]
  );

  // Auto-scroll to last message when messages change
  useEffect(() => {
    if (lastMessageRef.current && entity?.messages?.length) {
      const timeoutId = setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [entity?.messages?.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Component unmounted');
      }
    };
  }, []);

  // Render helpers
  const renderHeader = () => {
    if (entity?.id) {
      return (
        <>
          <div>
            <span>{entity.chattable_name}</span>
            {applicant?.phone && (
              <small className="text-muted ms-2">{formatPhoneNumber(applicant.phone)}</small>
            )}
          </div>
          <small>
            <b>{t('PREFERRED_HOURS')}: </b>
            <PreferredHours userPreferences={userPreferences} />
          </small>
          {/* Show provisioned phone number info */}
          {!phoneNumbersLoading && (
            <div className="mt-2">
              {companyPhoneNumbers.length > 0 ? (
                <small className="text-success">
                  <b>{t('SENDING_FROM')}: </b>
                  {formatPhoneNumber(companyPhoneNumbers[0].phoneNumber)}
                </small>
              ) : (
                <small className="text-danger">
                  <b>{t('NO_PHONE_NUMBER_PROVISIONED')}</b>
                </small>
              )}
            </div>
          )}
        </>
      );
    }

    if (canCreate) {
      return (
        <>
          <ComboBox options={handleSearch} onChange={handleConversationChange} minLength={3} />
          {form.errors?.chattable_id && (
            <span className="text-danger small">{t(String(form.errors.chattable_id))}</span>
          )}
        </>
      );
    }

    return t('NONE');
  };

  const hasMessages = entity?.messages && entity.messages.length > 0;
  const canShowForm = entity?.id || (canCreate && form.values.chattable_name);
  const hasPhoneNumbers = !phoneNumbersLoading && companyPhoneNumbers.length > 0;
  const canSendMessages = hasPhoneNumbers;

  return (
    <Card>
      <Card.Header style={{ cursor: 'default', color: 'black' }}>{renderHeader()}</Card.Header>

      {hasMessages && (
        <Card.Body>
          <ul className="list-unstyled" style={{ overflowY: 'auto', height: '50vh' }}>
            {entity.messages.map((message, index) => (
              <Message
                key={message.id}
                conversation={entity}
                message={message}
                showHeader={message.direction !== entity.messages[index - 1]?.direction}
                lastMessageRef={index === entity.messages.length - 1 ? lastMessageRef : null}
              />
            ))}
          </ul>
        </Card.Body>
      )}

      {canShowForm && (
        <Card.Footer>
          {!phoneNumbersLoading && !hasPhoneNumbers && (
            <div className="alert alert-warning mb-3">
              <strong>{t('MESSAGING_UNAVAILABLE')}</strong>
              <br />
              {t('NO_PHONE_NUMBER_PROVISIONED_MESSAGE')}
              <br />
              <small>{t('CONTACT_DRIVERFLY_SUPPORT_FOR_PHONE_NUMBER')}</small>
            </div>
          )}

          {phoneNumbersLoading && (
            <div className="alert alert-info mb-3">
              <LoaderIcon isLoading={true} /> {t('LOADING_PHONE_NUMBERS')}
            </div>
          )}

          <Form onSubmit={form.handleSubmit}>
            <Row>
              <Col md={10}>
                <BaseTextArea
                  name="message"
                  formik={form}
                  readOnly={!entity?.id && !canCreate}
                  disabled={!canSendMessages}
                  required
                  placeholder={canSendMessages ? 'MESSAGE' : 'MESSAGING_DISABLED_NO_PHONE_NUMBER'}
                  onChange={({ target: { value } }) => handleMessageChange(value)}
                />
              </Col>
              <Col md={2}>
                <div className="d-flex justify-content-center align-items-center h-100">
                  <button
                    disabled={form.isSubmitting || !canSendMessages}
                    type="submit"
                    className="btn btn-info"
                  >
                    {t('SEND')}
                    <LoaderIcon isLoading={form.isSubmitting} />
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Footer>
      )}
    </Card>
  );
}
