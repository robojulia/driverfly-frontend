import { useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  Newspaper,
  PersonBadgeFill,
  QuestionCircle,
} from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import Breadcrumb from "../components/breadcrumbs/breadcrumb";
import BaseInput from "../components/forms/base-input";
import BaseRecaptcha from "../components/forms/base-recaptcha";
import BaseTextArea from "../components/forms/base-text-area";
import { PublicLayout } from "../components/layouts/public-layout";
import { useTranslation } from "../hooks/use-translation";
import { ContactUsEntity } from "../models/contact/contact-us.entity";
import { globalAjaxExceptionHandler } from "../utils/ajax";
import ContactApi from "./api/contact";

export default function Contact() {
  const { t } = useTranslation();
  const contactApi = new ContactApi();

  const form = useFormik({
    initialValues: new ContactUsEntity(),
    validationSchema: ContactUsEntity.yupSchema(),
    onSubmit: async (dto) => {
      try {
        const res = await contactApi.sendMail(dto);
        toast.success(t("THANKS_FOR_CONTACTING_US"));
        form.resetForm();
      } catch (e) {
        if (e.response?.data?.recaptchaValue == "INVALID_RECAPTCHA_TOKEN")

          globalAjaxExceptionHandler(e, {
            formik: form,
            toast: toast,
            t: t,
            defaultMessage: "UNABLE_TO_SEND_ME",
          });
      }
    },
  });

  const handleReCapchaChange = (token: string) => {
    form.setFieldValue("recaptchaValue", token || null);
  };


  return (
    <>
      <Head>
        <title>{t("CONTACT_META_TITLE")}</title>
        <meta name="description" content={t("CONTACT_META_DESC")} key="desc" />
      </Head>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t("CONTACT")}</h2>
            <Breadcrumb />
          </div>
        </div>
      </div>

      <div className="contact-main py-5"></div>
      <div className="contact-form">
        <div className="container">
          <div className="row contact-inner bg-white">
            <div className="col-sm-12 col-lg-5 pl-0">
              <article>
                <div className="contact-infomation">
                  <h2>{t("CONTACT_INFORMARION")}</h2>
                  <p>{t("HAVE_QUENTIONS")}</p>
                  {/* <ul className="address_list">
          <li>
            <a href="#" className="nav-link px-0">
            {" "}
            {t("LOS_ANGELES_CA")}
            </a>
          </li>
          <li>
            <a href="mailto:#" className="nav-link px-0">
            {t("EMAIL_INFO_DRIVERFLY_CO")}
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-0">
            {t("Call_(614)_259_7225")}
            </a>
          </li>
          </ul> */}
                </div>
              </article>
            </div>
            <div className="col-sm-12 col-lg-7 contact-outer">
              <h3>{t("We_want_to_hear_form_you")}</h3>
              <div className="container p-0">
                <Row>
                  <Col>
                    <ToastContainer />
                    <form onSubmit={form.handleSubmit}>
                      <Row>
                        <BaseInput
                          className="col-md-6 mt-4"
                          required
                          name="name"
                          displayPlaceholder
                          formik={form}
                        />
                        <BaseInput
                          className="col-md-6 mt-4"
                          required
                          name="email"
                          displayPlaceholder
                          formik={form}
                        />
                        <BaseInput
                          className="col-12 mt-4"
                          name="subject"
                          displayPlaceholder
                          formik={form}
                        />
                        <BaseTextArea
                          className="col-12 my-4"
                          name="message"
                          displayPlaceholder
                          formik={form}
                        />
                      </Row>
                      <BaseRecaptcha
                        className="col-12 my-4"
                        name="recaptchaValue"
                        formik={form}
                        onChange={handleReCapchaChange}
                      />
                      <button
                        disabled={
                          form.isSubmitting || !form.isValid || !form.dirty
                        }
                        type="submit"
                        className="btn contact-submit-btn float-right py-3 px-5 mb-4"
                      >
                        {t("submit")} <ArrowRight />
                      </button>
                    </form>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="row mt-5 pt-4 contact-icon">
            <div className="col-md-4">
              <div className="contact-icon-inner">
                <PersonBadgeFill />
              </div>
              <h3 className="title text-center my-4">
                <Link href="/signup">
                  <a className="text-black">{t("WANT_TO_JOIN_US")}</a>
                </Link>
              </h3>
            </div>
            <div className="col-md-4">
              <div className="contact-icon-inner">
                <Newspaper />
              </div>
              <h3 className="title text-center my-4">
                <Link href="/blog">
                  <a className="text-black">{t("READ_OUR_LATEST_NEWS")}</a>
                </Link>
              </h3>
            </div>
            <div className="col-md-4">
              <div className="contact-icon-inner">
                <QuestionCircle />
              </div>
              <h3 className="title text-center my-4">
                <Link href="/faq">
                  <a className="text-black">{t("HAVE_QUESTIONS")}</a>
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Contact.getLayout = function getLayout(page) {
  return <PublicLayout title="contact">{page}</PublicLayout>;
};
