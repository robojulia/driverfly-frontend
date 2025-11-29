import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { ChatDots, Send } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { EmployeeEntity } from '../../models/employee/employee.entity';
import { ConversationEntity } from '../../models/conversation/conversation.entity';
import { ConversationMessageEntity } from '../../models/conversation/conversation-message.entity';
import { ChattableType } from '../../enums/conversation/chattable-type.enum';
import { ConversationApi } from '../../pages/api/conversation';
import { useTranslation } from '../../hooks/use-translation';
import { useAuth } from '../../hooks/use-auth';
import { Message } from '../messenger/message';
import BaseTextArea from '../forms/base-text-area';
import { LoaderIcon } from '../loading/loader-icon';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import CompanyApi from '../../pages/api/company';
import { CompanyPhoneNumberEntity } from '../../models/company/company-phone-number.entity';
import { messengerSocketInitializer } from '../messenger/socketInitializer';

export interface EmployeeMessagesProps {
  employee: EmployeeEntity;
}

const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export function EmployeeMessages({ employee }: EmployeeMessagesProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const conversationApi = new ConversationApi();
  const companyApi = new CompanyApi();

  const [conversation, setConversation] = useState<ConversationEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyPhoneNumbers, setCompanyPhoneNumbers] = useState<CompanyPhoneNumberEntity[]>([]);
  const [phoneNumbersLoading, setPhoneNumbersLoading] = useState(true);
  const lastMessageRef = React.createRef<HTMLLIElement>();

  // Fetch conversation for this employee
  useEffect(() => {
    const fetchConversation = async () => {
      if (!employee?.id) return;

      try {
        setLoading(true);
        const conversations = await conversationApi.list();

        // Find conversation for this employee
        const existingConversation = conversations.find(
          (c) => c.chattable_type === ChattableType.EMPLOYEE && c.chattable_id === employee.id
        );

        if (existingConversation) {
          // Fetch full conversation with messages
          const fullConversation = await conversationApi.getById(existingConversation.id);
          setConversation(fullConversation);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id]);

  // Fetch company phone numbers
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      if (!user?.company?.id) {
        setPhoneNumbersLoading(false);
        return;
      }

      try {
        setPhoneNumbersLoading(true);
        const phoneNumbers = await companyApi.phoneNumbers.list(user.company.id);
        setCompanyPhoneNumbers(phoneNumbers);
      } catch (error) {
        console.error('Error fetching company phone numbers:', error);
        setCompanyPhoneNumbers([]);
      } finally {
        setPhoneNumbersLoading(false);
      }
    };

    fetchPhoneNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.company?.id]);

  // Socket handling for real-time updates
  useEffect(() => {
    const handleInboundMessage = (message: ConversationMessageEntity) => {
      if (message?.conversation?.id === conversation?.id) {
        setConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), message],
            lastMessage: message,
          };
        });
      }
    };

    const handleOutboundMessageStatus = (message: ConversationMessageEntity) => {
      if (message?.conversation?.id === conversation?.id) {
        setConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages?.map((m) => (m.id === message.id ? message : m)) || [],
            lastMessage: prev.lastMessage?.id === message.id ? message : prev.lastMessage,
          };
        });
      }
    };

    if (user && conversation?.id) {
      messengerSocketInitializer(user, handleInboundMessage, handleOutboundMessageStatus);
    }
  }, [user, conversation?.id]);

  // Auto-scroll to last message
  useEffect(() => {
    if (lastMessageRef.current && conversation?.messages?.length) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.messages?.length]);

  const form = useFormik({
    initialValues: { message: '' },
    onSubmit: async (values, { resetForm }) => {
      if (!values.message?.trim()) {
        toast.error(t('MESSAGE_CANNOT_BE_EMPTY'));
        return;
      }

      // Check if company has provisioned phone numbers
      if (!phoneNumbersLoading && companyPhoneNumbers.length === 0) {
        toast.error(t('NO_PHONE_NUMBER_PROVISIONED_CONTACT_SUPPORT'));
        return;
      }

      try {
        let conv = conversation;

        // Create conversation if it doesn't exist
        if (!conv) {
          conv = await conversationApi.create({
            chattable_type: ChattableType.EMPLOYEE,
            chattable_id: employee.id,
            chattable_name: `${employee.first_name} ${employee.last_name}`,
            message: values.message.trim(),
          });

          // Fetch full conversation with the first message
          const fullConv = await conversationApi.getById(conv.id);
          setConversation(fullConv);
          resetForm();
          toast.success(t('MESSAGE_SENT_SUCCESSFULLY'));
          return;
        }

        // Send message to existing conversation
        const newMessage = await conversationApi.messages.create(conv.id, {
          text: values.message.trim(),
        });

        // Update conversation with new message
        setConversation({
          ...conv,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: newMessage,
        });

        resetForm();
        toast.success(t('MESSAGE_SENT_SUCCESSFULLY'));
      } catch (error) {
        console.error('Error sending message:', error);
        globalAjaxExceptionHandler(error, { formik: form, t, toast });
      }
    },
  });

  const hasPhoneNumbers = !phoneNumbersLoading && companyPhoneNumbers.length > 0;
  const canSendMessages = hasPhoneNumbers;
  const hasMessages = conversation?.messages && conversation.messages.length > 0;

  if (loading) {
    return (
      <div className="bg-white p-4 rounded">
        <h4>
          <ChatDots className="me-2" />
          {t('TEXT_MESSAGES')}
        </h4>
        <div className="text-center py-4">
          <LoaderIcon isLoading={true} /> {t('LOADING')}...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded">
      <h4>
        <ChatDots className="me-2" />
        {t('TEXT_MESSAGES')}
      </h4>
      <p className="text-muted mb-4">{t('VIEW_AND_SEND_TEXT_MESSAGES_TO_EMPLOYEE')}</p>

      <Card>
        <Card.Header style={{ cursor: 'default', color: 'black' }}>
          <div>
            <span>{employee.first_name} {employee.last_name}</span>
            {employee?.phone && (
              <small className="text-muted ms-2">{formatPhoneNumber(employee.phone)}</small>
            )}
          </div>
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
        </Card.Header>

        {hasMessages && (
          <Card.Body>
            <ul className="list-unstyled" style={{ overflowY: 'auto', maxHeight: '50vh' }}>
              {conversation.messages.map((message, index) => (
                <Message
                  key={message.id}
                  conversation={conversation}
                  message={message}
                  showHeader={message.direction !== conversation.messages[index - 1]?.direction}
                  lastMessageRef={index === conversation.messages.length - 1 ? lastMessageRef : null}
                />
              ))}
            </ul>
          </Card.Body>
        )}

        {!hasMessages && (
          <Card.Body>
            <div className="text-center text-muted py-4">
              <ChatDots size={48} className="mb-2 opacity-50" />
              <p>{t('NO_MESSAGES_YET')}</p>
              <p className="small">{t('SEND_A_MESSAGE_TO_START_CONVERSATION')}</p>
            </div>
          </Card.Body>
        )}

        <Card.Footer>
          {!phoneNumbersLoading && !hasPhoneNumbers && (
            <Alert variant="warning" className="mb-3">
              <strong>{t('MESSAGING_UNAVAILABLE')}</strong>
              <br />
              {t('NO_PHONE_NUMBER_PROVISIONED_MESSAGE')}
              <br />
              <small>{t('CONTACT_DRIVERFLY_SUPPORT_FOR_PHONE_NUMBER')}</small>
            </Alert>
          )}

          {phoneNumbersLoading && (
            <Alert variant="info" className="mb-3">
              <LoaderIcon isLoading={true} /> {t('LOADING_PHONE_NUMBERS')}
            </Alert>
          )}

          <Form onSubmit={form.handleSubmit}>
            <Row>
              <Col md={10}>
                <BaseTextArea
                  name="message"
                  formik={form}
                  disabled={!canSendMessages}
                  required
                  placeholder={canSendMessages ? 'MESSAGE' : 'MESSAGING_DISABLED_NO_PHONE_NUMBER'}
                  onChange={({ target: { value } }) => form.setFieldValue('message', value)}
                />
              </Col>
              <Col md={2}>
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Button
                    disabled={form.isSubmitting || !canSendMessages}
                    type="submit"
                    variant="info"
                  >
                    <Send /> {t('SEND')}
                    <LoaderIcon isLoading={form.isSubmitting} />
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
}
