import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Row } from 'react-bootstrap';
import { useTranslation } from '../../../hooks/use-translation';
import { toast } from 'react-toastify';
import BaseInput from '../base-input';
import BaseInputPhone from '../base-input-phone';
import EntityForm from '../../layouts/page/entity-form';
import { formSuccess } from '../../../utils/toast';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { BaseFormProps } from './base-form-props';
import { CompanyManagerEntity } from '../../../models/company/company-manager.entity';
import CompanyApi from '../../../pages/api/company';

export interface ManagerFormProps extends BaseFormProps<CompanyManagerEntity> {}

export function ManagerForm(props: ManagerFormProps) {
  const { t } = useTranslation();
  const companyApi = new CompanyApi();
  let { className, entity, onSaveComplete, onSaveError } = props;

  const form = useFormik({
    initialValues: new CompanyManagerEntity(),
    validationSchema: CompanyManagerEntity.yupSchema(t),
    onSubmit: async (dto) => {
      try {
        let manager = null;
        if (entity?.id) {
          manager = await companyApi.manager.update(entity.id, dto);
        } else {
          manager = await companyApi.manager.create(dto);
        }
        formSuccess(t, !!entity?.id ? 'update' : 'create', 'MANAGER');
        if (onSaveComplete) onSaveComplete(manager);
      } catch (e) {
        console.error('Unable to save entity', e.response);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: 'UNABLE_TO_SAVE_INFORMATION',
        });

        if (onSaveError) onSaveError(e);
      }
    },
  });

  useEffect(() => {
    console.log('entity', entity);

    if (entity && !form.dirty) form.setValues(entity);
  }, [entity]);

  return (
    <EntityForm className={className} onSubmit={form.handleSubmit} formik={form} id={entity?.id}>
      <Row className="mt-2">
        <BaseInput
          className="col-6 mt-1"
          label="NAME"
          name="name"
          required
          displayPlaceholder
          formik={form}
        />
        <BaseInput
          className="col-6 mt-1"
          label="EMAIL"
          name="email"
          required
          displayPlaceholder
          formik={form}
        />
        <BaseInputPhone className="col-6 mt-1" label="phone" name="phone" formik={form} />
      </Row>
    </EntityForm>
  );
}
