import { Button, Col, Row } from 'react-bootstrap';

import Link from 'next/link';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Head from 'next/head';

import { PublicLayout } from '../../components/layouts/public-layout';
import { PublicPage } from '../../components/layouts/public/public-page';
import BaseInput from '../../components/forms/base-input';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import AuthApi from '../api/auth';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import { LoginDto } from '../../models/auth/login.dto';

export default function Login() {
  const { t } = useTranslation();

  const { login } = useAuth();

  const authApi = new AuthApi();

  const form = useFormik({
    initialValues: new LoginDto(),
    validationSchema: LoginDto.yupSchema(),
    onSubmit: async (values) => {
      try {
        const user = await authApi.login(values);

        toast.success(t('LOGIN_SUCCESSFULL'));
        login(user);
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          formik: form,
          t: t,
          defaultMessage: 'INVALID_CREDENTIALS',
          toast: toast,
        });
      }
    },
  });

  return (
    <PublicPage title="LOGIN">
      <Head>
        <title> {t('LOGIN_META_TITLE')} </title>
        <meta name="description" content={t('LOGIN_META_DESC')} key="desc" />
      </Head>
      <Row className="mb-2 mt-3">
        <Col>
          <p className=" text-secondary">
            {t("DON'T_HAVE_AN_ACCOUNT_MAKE_ONE")}
            <Link href="/signup">
              <a className="primary ml-1">{t('HERE')}</a>
            </Link>
            !
          </p>
          <h2 className="text-center mt-3">{t('QUICK_LOGIN')}</h2>
          <p className="mt-3 text-center">{t('LOGIN_YOUR_ACCOUNT')}</p>
        </Col>
      </Row>
      <Row className="justify-content-lg-center">
        <Col lg="8">
          <form onSubmit={form.handleSubmit}>
            <BaseInput
              className="form-group"
              label={t('EMAIL')}
              required
              name="email"
              displayPlaceholder
              formik={form}
            />
            <BaseInput
              className="form-group"
              label={t('PASSWORD')}
              required
              type="password"
              name="password"
              displayPlaceholder
              formik={form}
            />

            <Row>
              <Col>
                <div className="form-group form-check">
                  <label className="form-check-label">
                    <input className="form-check-input" type="checkbox" /> {t('KEEP_ME_SIGNED_IN')}
                  </label>
                </div>
              </Col>
              <Col className="text-end">
                <Link href="/forgot-password">
                  <a className="primary">{t('LOST_YOUR_PASSWORD')}</a>
                </Link>
              </Col>
            </Row>
            <div className="d-grid gap-2 mt-4">
              <Button disabled={form.isSubmitting} className="w-100" size="lg" type="submit">
                {form.isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {t('LOGGING_IN')}
                  </>
                ) : (
                  t('LOGIN')
                )}
              </Button>
              <div className="my-1 w-100 text-center">
                <span>{t('OR')}</span>
              </div>
              <Link href="/signup">
                <Button size="lg" className="w-100">
                  {t('CREATE_AN_ACCOUNT')}
                </Button>
              </Link>
            </div>
          </form>
        </Col>
      </Row>
    </PublicPage>
  );
}

Login.getLayout = function getLayout(page) {
  return <PublicLayout title="Login">{page}</PublicLayout>;
};
