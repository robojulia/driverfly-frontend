import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Dropdown, Button, Row } from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import ViewModal from '../view-details/view-modal';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';
import CompanyApi from '../../pages/api/company';
import AuthApi from '../../pages/api/auth';
import UserApi from '../../pages/api/user';
import { useFormik } from 'formik';
import BaseSelect from '../forms/base-select';
import { toast, ToastContainer } from 'react-toastify';
import { CompanyEntity } from '../../models/company/company.entity';
import { UserEntity } from '../../models/user/user.entity';

import * as yup from 'yup';
import { useEffectAsync } from '../../utils/react';

export default function Impersonate() {
  const { user, login, isImpersonating, isSuperAdmin } = useAuth();

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const router = useRouter();

  /**
   *
   * @param {React.MouseEvent<HTMLelement>} e
   */
  const onClick = (e) => {
    setOpen(true);
  };

  const [companies, setCompanies] = useState<CompanyEntity[]>([]);

  const [users, setUsers] = useState<UserEntity[]>([]);

  useEffectAsync(async () => {
    if (open) {
      const api = new AuthApi();

      const companies = await api.findCompanies();

      companies.splice(0, 0, { id: -1, name: `----${t('DRIVERS')}----` });

      setCompanies(companies);
    }
  }, [open]);

  const onSubmit = async (e) => {
    const api = new AuthApi();

    const auth = await api.impersonate(e);

    setOpen(false);

    login(auth);

    await router.reload();
  };

  const form = useFormik({
    initialValues: {
      companyId: null,
      userId: null,
    },
    validationSchema: yup.object({
      companyId: yup.number().required().nullable(),
      userId: yup
        .number()
        .when('companyId', {
          is: -1,
          then: yup.number().required().nullable(),
        })
        .nullable(),
    }),
    onSubmit: onSubmit,
  });

  /**
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e
   */
  const onCompanyChange = (e) => {
    const { value } = e.target;

    form.setValues({
      companyId: value,
      userId: null,
    });
  };

  useEffectAsync(async () => {
    if (form.values.companyId) {
      const api = new UserApi();

      setUsers(await api.list(form.values.companyId));
    } else setUsers([]);
  }, [form.values.companyId]);

  /**
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e
   */
  const onRestoreClick = (e) => {
    onSubmit({
      companyId: user.jwt.impersonatedBy.company,
      userId: user.jwt.impersonatedBy.user,
    });
  };

  const canSubmit = !form.isSubmitting && form.isValid && !form.isValidating;

  if (!isSuperAdmin) return null;

  return (
    <>
      <Dropdown.Item className="text-dark" onClick={onClick}>
        {t('IMPERSONATE')}
      </Dropdown.Item>
      <ViewModal
        title="IMPERSONATE"
        onCloseClick={() => setOpen(false)}
        show={open}
        footer={
          <>
            {isImpersonating && (
              <Button disabled={!canSubmit} variant="secondary" onClick={onRestoreClick}>
                <ArrowCounterclockwise /> {t('RESTORE')}
              </Button>
            )}
            <Button disabled={!canSubmit} onClick={(e) => form.submitForm()}>
              {t('IMPERSONATE')}
            </Button>
          </>
        }
      >
        <form>
          <Row>
            <BaseSelect
              className="col-12"
              label="COMPANY"
              name="companyId"
              displayPlaceholder
              onChange={onCompanyChange}
              options={companies}
              valueKey="id"
              createLabel={(c) => (c.id < 0 ? c.name : `${c.name || t('NO_NAME')} (#${c.id})`)}
              formik={form}
            />
            <BaseSelect
              className="col-12"
              label="USER"
              name="userId"
              displayPlaceholder
              options={users}
              valueKey="id"
              createLabel={(c) => `${c.name} (#${c.id})`}
              formik={form}
            />
          </Row>
        </form>
      </ViewModal>
    </>
  );
}
