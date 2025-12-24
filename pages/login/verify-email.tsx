import { toast } from 'react-toastify'
import { Alert, Button, Col, Form, Row } from "react-bootstrap"

import { globalAjaxExceptionHandler } from '../../utils/ajax';

import { useRouter } from "next/router";
import { useFormik } from "formik";
import { useAuth } from "../../hooks/use-auth";
import { useTranslation } from "../../hooks/use-translation"

import { PublicLayout } from "../../components/layouts/public-layout";
import { PublicPage } from "../../components/layouts/public/public-page"

import AuthApi from "../api/auth";
import { VerifyEmailDto } from "../../models/auth/verify-email.dto";
import React, { useEffect, useMemo, useCallback } from 'react';
import BaseInput from '../../components/forms/base-input';

export default function VerifyEmail(props: VerifyEmailDto) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, updateUser, login } = useAuth();

  const api = useMemo(() => new AuthApi(), []);

  const form = useFormik({
    initialValues: new VerifyEmailDto(),
    validationSchema: VerifyEmailDto.yupSchema(),
    onSubmit: async (dto) => {
      try {
        await api.verifyEmail(dto);

        toast.success(t("EMAIL_VERIFIED"));

        if (user) {
          updateUser({
            ...user,
            emailTokenTimestamp: null,
          });
        }
        else {
          await router.replace("/login");
        }
      }
      catch (e) {
        globalAjaxExceptionHandler(e, { formik: form, t: t, defaultMessage: "UNABLE_TO_VERIFY", toast: toast});
      }
    }
  });

  const resendVerify = useCallback(async (e?: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (form.values.email) {
        await api.sendVerifyEmail(form.values.email);

        if (user) {
          updateUser({
            ...user,
            email: form.values.email
          });
        }

        toast.success(t("PLEASE_CHECK_EMAIL"));
      }
      else {
        toast.error(t("EMAIL_IS_REQUIRED"));
      }
    }
    catch (e) {
      globalAjaxExceptionHandler(e, { formik: form, t: t, defaultMessage: "UNABLE_TO_VERIFY", toast: toast});
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, form.values.email, user, updateUser, t])

  useEffect(() => {
    if (user) {
      if (!user.emailTokenTimestamp) {
        login(user);
        return; // no need to verify
      } else {
        form.setValues({
          ...form.values,
          ...props,
          email: user.email
        });
      }
    }
    else if (props.email || props.token) {
      form.setValues({
        ...form.values,
        ...props
      });
    } else {
      router.replace("/")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ props, user ]);

  return (
    <PublicPage
      title="VERIFY_EMAIL"
      >
      <Row className='mt-3'>
          <Col className="text-center">
              <h2>{t("VERIFY_EMAIL")}</h2>
              <p className="mt-3">{t("VerifyEmail.CHECK_YOUR_EMAIL_TO_VERIFY")}</p>
          </Col>
      </Row>
      <Row className="mt-2 justify-content-lg-center">
        <Col lg="8">
          <Form
            onSubmit={form.handleSubmit}>
            <BaseInput
                className="form-group"
                label="EMAIL"
                required
                name="email"
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
              <Button disabled={form.isSubmitting || !form.isValid} size="lg" type="submit">{t("VERIFY")}</Button>
              <div className="my-1 w-100 text-center">
                  <span>{t("OR")}</span>
              </div>
              <Button disabled={form.isSubmitting} size="lg" onClick={resendVerify}>{t("VerifyEmail.RESEND_VERIFICATION_EMAIL")}</Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-lg-center">
        <Col lg="8">
          <Alert variant='info'>{t("TECHNICAL_ASSISTANCE_HELP")}</Alert>
        </Col>
      </Row>
    </PublicPage>
  )
}
export async function getServerSideProps({ query }) {
  const { token, email } = query || {};

  return { props: { token: token || "", email: email || "" } }
}

VerifyEmail.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      {page}
    </PublicLayout>
  )
}