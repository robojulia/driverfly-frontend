import { toast } from 'react-toastify';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';

import { globalAjaxExceptionHandler } from '../../utils/ajax';

import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';

import { PublicLayout } from '../../components/layouts/public-layout';
import { PublicPage } from '../../components/layouts/public/public-page';

import AuthApi from '../api/auth';
import { VerifyPhoneDto } from '../../models/auth/verify-phone.dto';
import React, { useEffect, useMemo, useCallback } from 'react';
import BaseInput from '../../components/forms/base-input';
import BaseInputPhone from '../../components/forms/base-input-phone';

export default function VerifyPhone(props: VerifyPhoneDto) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, updateUser, login } = useAuth();

  const api = useMemo(() => new AuthApi(), []);

  const form = useFormik({
    initialValues: new VerifyPhoneDto(),
    validationSchema: VerifyPhoneDto.yupSchema(),
    onSubmit: async (dto) => {
      try {
        await api.verifyPhone(dto);

        toast.success(t('PHONE_VERIFIED'));

        if (user) {
          updateUser({
            ...user,
            phoneTokenTimestamp: null,
          });
        } else {
          await router.replace('/login');
        }
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          formik: form,
          t: t,
          defaultMessage: 'Unable to verify',
          toast: toast,
        });
      }
    },
  });

  const resendVerify = useCallback(async (e?: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!form.values.phone) {
        toast.error(t('PHONE_IS_REQUIRED'));
      } else {
        await api.sendVerifyPhone(form.values);

        updateUser({
          ...user,
          cell_number: form.values.phone,
        });

        toast.success(t('PLEASE_CHECK_PHONE'));
      }
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        formik: form,
        t: t,
        defaultMessage: 'Unable to verify',
        toast: toast,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, form.values, user, updateUser, t])

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (user) {
      if (!user.phoneTokenTimestamp) {
        login(user);
        return; // no need to verify
      } else {
        form.setValues({
          ...form.values,
          ...props,
          phone: user.cell_number,
        });
      }
    } else if (props.phone || props.token) {
      form.setValues({
        ...form.values,
        ...props,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, user]);

  return (
    <PublicPage title="VERIFY_PHONE">
      <Row className="mt-3">
        <Col className="text-center">
          <h2>{t('VERIFY_PHONE')}</h2>
          <p className="mt-3">{t('VerifyPhone.CHECK_YOUR_PHONE_TO_VERIFY')}</p>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-lg-center">
        <Col lg="8">
          <Form onSubmit={form.handleSubmit}>
            <BaseInputPhone
              className="form-group"
              label="PHONE"
              required
              name="phone"
              displayPlaceholder
              formik={form}
            />
            <BaseInput
              className="form-group"
              label="TOKEN"
              required
              name="token"
              displayPlaceholder
              formik={form}
            />
            <div className="d-grid gap-2 mt-4">
              <Button disabled={form.isSubmitting || !form.isValid} size="lg" type="submit">
                {t('VERIFY')}
              </Button>
              <div className="my-1 w-100 text-center">
                <span>{t('OR')}</span>
              </div>
              <Button disabled={form.isSubmitting} size="lg" onClick={resendVerify}>
                {t('VerifyPhone.RESEND_VERIFICATION_TEXT')}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-lg-center">
        <Col lg="8">
          <Alert variant="info">{t('TECHNICAL_ASSISTANCE_HELP')}</Alert>
        </Col>
      </Row>
    </PublicPage>
  );
}
export async function getServerSideProps({ query }) {
  const { token, phone } = query || {};

  return { props: { token: token || '', phone: phone || '' } };
}

VerifyPhone.getLayout = function getLayout(page) {
  return <PublicLayout>{page}</PublicLayout>;
};
