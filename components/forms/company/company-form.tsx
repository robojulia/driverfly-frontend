import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BaseClickToCopyInput from '../../../components/forms/base-click-to-copy-input';
import { useAuth } from '../../../hooks/use-auth';
import { useTranslation } from '../../../hooks/use-translation';
import { CompanyEntity } from '../../../models/company/company.entity';
import CompanyApi from '../../../pages/api/company';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { formSuccess } from '../../../utils/toast';

import { UncontrolledTooltip } from 'reactstrap';
import EntityForm from '../../layouts/page/entity-form';
import BaseInput from '../base-input';
import BaseInputPhone from '../base-input-phone';
import BaseTextArea from '../base-text-area';
import BaseMultiSelect from '../base-multiselect';
import FileInput from '../file-input';
import { BaseFormProps } from './base-form-props';
import Image from 'next/image';
import DocumentApi from '../../../pages/api/document';
import { useEffectAsync } from '../../../utils/react';
import { EmbeddedCodeExamples } from './embedded-code-examples';

export interface CompanyFormProps extends BaseFormProps<CompanyEntity> {
  showClickToCopy?: boolean | (() => boolean);
  skipApiCall?: boolean; // If true, form will not make API call but just pass data to onSaveComplete
}

export function CompanyForm(props: CompanyFormProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  let { className, entity, onSaveComplete, onSaveError, showClickToCopy, skipApiCall } = props;

  const [viewLogo, setViewLogo] = useState('');

  const form = useFormik({
    initialValues: new CompanyEntity(),
    validationSchema: CompanyEntity.yupSchema(t),
    onSubmit: async (dto) => {
      try {
        // If skipApiCall is true, just pass the form data to onSaveComplete without making API call
        if (skipApiCall) {
          if (onSaveComplete) onSaveComplete(dto);
          return;
        }

        // Normal API call flow
        const api = new CompanyApi();
        let company = null;
        if (entity?.id) {
          company = await api.update(entity.id, dto);
        } else {
          company = await api.create(dto);
        }
        formSuccess(t, !!entity?.id ? 'update' : 'create', 'COMPANY');
        if (onSaveComplete) onSaveComplete(company);
      } catch (e) {
        console.error('Unable to save entity', e.response);
        globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });

        if (onSaveError) onSaveError(e);
      }
    },
  });

  useEffect(() => {
    if (entity && !form.dirty) form.setValues(entity);
  }, [entity]);

  useEffectAsync(async () => {
    if (!form.values?.photo) {
      setViewLogo('');
    } else if (form.values?.photo?.id) {
      const api = new DocumentApi();
      const document = await api.getSignedUrl(form?.values?.photo?.id);
      setViewLogo(document?.path);
    } else if (form.values?.photo?.path) {
      setViewLogo(form.values.photo.path);
    }
  }, [form.values?.photo]);

  return (
    <>
      <EntityForm className={className} onSubmit={form.handleSubmit} formik={form} id={entity?.id}>
        <Row>
          <BaseInput
            className="col-12 mt-2"
            label={t('NAME')}
            name={`name`}
            required
            placeholder={t('NAME')}
            formik={form}
          />
          <BaseInput
            className="col-12 mt-2"
            label={t('HEADQUATERS')}
            name={`location`}
            placeholder={t('ADD_HEADQUATERS_LOCATION')}
            formik={form}
          />
          <BaseInput
            className="col-12 mt-2"
            label={t('WEBSITE')}
            name={`website`}
            placeholder="http://www.example.com"
            formik={form}
          />
          {Boolean(showClickToCopy) && (
            <>
              <BaseClickToCopyInput
                label="COMPANY_JOBS_PAGE"
                className="rounded"
                value={`${process.env.FRONTEND_BASE_URL ?? ''}employer/${user?.company?.slug}`}
                tooltipText={t('CLICK_TO_COPY')}
              />
              <BaseClickToCopyInput
                label="COMPANY_EMEDDED_JOBS_PAGE"
                className="rounded mt-2"
                value={`${process.env.FRONTEND_BASE_URL ?? ''}embedded?companyId=${
                  user?.company?.id
                }`}
                tooltipText={t('CLICK_TO_COPY')}
              />
            </>
          )}
          <BaseTextArea
            className="col-12 mt-2"
            label={t('ABOUT')}
            name={`about`}
            rows={3}
            placeholder={t('ABOUT_PLACEHOLDER')}
            formik={form}
          />
          <FileInput
            className="col-12 mt-2"
            label={`COMPANY_LOGO`}
            id="imgpurpose"
            name={`photo`}
            accept="image/*"
            allowedSizeInByte={3145728}
            documentType={'PHOTO'}
            formik={form}
          />
          {viewLogo && (
            <div className="col-12">
              <img
                className="img-thumbnail"
                src={viewLogo}
                style={{ maxWidth: '500px', height: 'auto' }}
              />
            </div>
          )}
          <UncontrolledTooltip delay={0} placement="top" target="imgpurpose">
            {t('IMAGE_PURPOSE')}
          </UncontrolledTooltip>

          <BaseInputPhone
            className="col-3 mt-2"
            label="PHONE"
            name="phone"
            placeholder="PHONE"
            formik={form}
          />

          <p className="mt-3">{t('SOCIAL_MEDIA_LINKS')}</p>
          <div className="p-0 d-flex justify-content-start ">
            <div className="col-3">
              <BaseInput
                className=""
                label={t('FACEBOOK')}
                name={`facebook`}
                placeholder="http://www.facebook.com"
                formik={form}
              />
            </div>
            <div className="col-3">
              <BaseInput
                className=""
                label={t('INSTAGRAM')}
                name={`instagram`}
                placeholder="http://www.instagram.com"
                formik={form}
              />
            </div>
            <div className="col-3">
              <BaseInput
                className=""
                label={t('LINKEDIN')}
                name={`linkedin`}
                placeholder="http://www.linkedin.com"
                formik={form}
              />
            </div>
            <div className="col-3">
              <BaseInput
                className=""
                label={t('TWITTER')}
                name={`twitter`}
                placeholder="http://www.twitter.com"
                formik={form}
              />
            </div>
          </div>

          {/* Company Information for Candidate Communication */}
          <div className="col-12 mt-4">
            <h5 className="mb-3">{t('COMPANY_DETAILS_FOR_RECRUITING')}</h5>
            <p className="text-muted mb-3">{t('COMPANY_DETAILS_HELP_TEXT')}</p>
          </div>

          <BaseInput
            className="col-6 mt-2"
            label={t('FLEET_SIZE')}
            name="fleet_size"
            placeholder={t('FLEET_SIZE_PLACEHOLDER')}
            formik={form}
          />
          <BaseInput
            className="col-6 mt-2"
            label={t('FOUNDED_YEAR')}
            name="founded_year"
            type="number"
            placeholder="1995"
            formik={form}
          />
          <BaseInput
            className="col-12 mt-2"
            label={t('SAFETY_RATING')}
            name="safety_rating"
            placeholder={t('SAFETY_RATING_PLACEHOLDER')}
            formik={form}
          />
          <BaseTextArea
            className="col-12 mt-2"
            label={t('COMPANY_CULTURE')}
            name="company_culture"
            rows={3}
            placeholder={t('COMPANY_CULTURE_PLACEHOLDER')}
            formik={form}
          />
          <BaseTextArea
            className="col-12 mt-2"
            label={t('COMPANY_BENEFITS')}
            name="company_benefits"
            rows={3}
            placeholder={t('COMPANY_BENEFITS_PLACEHOLDER')}
            formik={form}
          />
          <BaseMultiSelect
            className="col-12 mt-2"
            label={t('SPECIALTIES')}
            name="specialties"
            placeholder={t('SPECIALTIES_PLACEHOLDER')}
            formik={form}
            options={[
              { value: 'Long Haul', label: t('LONG_HAUL') },
              { value: 'Regional', label: t('REGIONAL') },
              { value: 'Local Delivery', label: t('LOCAL_DELIVERY') },
              { value: 'Dedicated Freight', label: t('DEDICATED_FREIGHT') },
              { value: 'Owner Operator', label: t('OWNER_OPERATOR_SPECIALTY') },
              { value: 'Lease Purchase', label: t('LEASE_PURCHASE') },
              { value: 'Flatbed', label: t('FLATBED') },
              { value: 'Refrigerated', label: t('REFRIGERATED') },
              { value: 'Dry Van', label: t('DRY_VAN') },
              { value: 'Tanker', label: t('TANKER') },
              { value: 'Hazmat', label: t('HAZMAT') },
              { value: 'Oversized Loads', label: t('OVERSIZED_LOADS') },
              { value: 'Team Driving', label: t('TEAM_DRIVING') },
              { value: 'Training Provided', label: t('TRAINING_PROVIDED') },
            ]}
          />
        </Row>
      </EntityForm>

      {entity?.id && <EmbeddedCodeExamples companyId={entity.id} />}
    </>
  );
}
