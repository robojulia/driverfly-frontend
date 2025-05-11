import { Row, Button, Col, Card } from "react-bootstrap";
import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import SupportApi from "../../pages/api/support";
import { useTranslation } from "../../hooks/use-translation";
import BaseInput from "../forms/base-input";
import { SupportDto } from "../../models/support/support.dto";
import FileInput from "../forms/file-input";
import { DocumentEntity } from "../../models/documents/document.entity";
import BaseTextArea from "../forms/base-text-area";

const OS_OPTIONS = [
  { label: "Windows", value: "Windows" },
  { label: "macOS", value: "macOS" },
  { label: "Linux", value: "Linux" },
  { label: "iOS", value: "iOS" },
  { label: "Android", value: "Android" },
];

export default function Support() {
  const { t } = useTranslation();
  const api = new SupportApi();

  const form = useFormik({
    initialValues: {
      ...new SupportDto(),
      operating_system: detectOS(), // Auto-detect OS
    },
    validationSchema: SupportDto.yupSchema(),
    onSubmit: async (dto, { resetForm }) => {
      dto.documents = dto?.documents?.filter((v) => Boolean(v?.file_base64));
      try {
        await api.reportIssue(dto);
        resetForm();
        toast.success(t("SUCCESSFULLY_TO_DEVELOPER"));
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: "UNABLE_TO_SEND_EMAIL",
        });
      }
    },
  });

  // Detect operating system
  function detectOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("win")) return "Windows";
    if (userAgent.includes("mac")) return "macOS";
    if (userAgent.includes("linux")) return "Linux";
    if (userAgent.includes("iphone") || userAgent.includes("ipad"))
      return "iOS";
    if (userAgent.includes("android")) return "Android";
    return "";
  }

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      form.values.description &&
      form.values.operating_system &&
      form.values.page_path_url &&
      !form.isSubmitting
    );
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Body>
        <div className="mb-4">
          <h4>{t("HOW_CAN_WE_HELP")}</h4>
          <p className="text-muted">{t("SUPPORT_INTRO_TEXT")}</p>
        </div>

        <form onSubmit={form.handleSubmit}>
          <Row>
            <Col sm={12} className="mb-4">
              <BaseTextArea
                label={t("ISSUE_DESCRIPTION")}
                name="description"
                rows={4}
                required
                formik={form}
                helpText={t("ISSUE_DESCRIPTION_HELP")}
              />
            </Col>

            <Col sm={12} className="mb-4">
              <label className="form-label">
                {t("OPERATING_SYSTEM")} <span className="text-danger">*</span>
              </label>
              <div className="d-flex gap-2 mb-2">
                {OS_OPTIONS.map((os) => (
                  <Button
                    key={os.value}
                    variant={
                      form.values.operating_system === os.value
                        ? "primary"
                        : "outline-secondary"
                    }
                    size="sm"
                    onClick={() =>
                      form.setFieldValue("operating_system", os.value)
                    }
                    className="rounded-pill"
                  >
                    {os.label}
                  </Button>
                ))}
              </div>
              <div className="form-text text-muted">
                {t("OS_DETECTED", { os: form.values.operating_system })}
              </div>
              {form.touched.operating_system &&
                form.errors.operating_system && (
                  <div className="text-danger small">
                    {form.errors.operating_system}
                  </div>
                )}
            </Col>

            <Col sm={12} className="mb-4">
              <BaseInput
                label="Page URL"
                name="page_path_url"
                required
                formik={form}
                helpText={t("PAGE_URL_HELP")}
              />
            </Col>

            <Col sm={12} className="mb-4">
              <label className="form-label">{t("SUPPORTING_DOCS")}</label>
              <div className="form-text text-muted mb-3">
                {t("DOCS_HELP_TEXT")}
                <ul className="mt-2 mb-3">
                  <li>{t("DOCS_LIST_SCREENSHOTS")}</li>
                  <li>{t("DOCS_LIST_ERRORS")}</li>
                  <li>{t("DOCS_LIST_LOGS")}</li>
                </ul>
                <div className="small">{t("DOCS_FORMAT_INFO")}</div>
              </div>

              {Boolean(form.values.documents?.length) ? (
                form.values.documents?.map((document, i) => (
                  <div className="mb-3 border rounded p-3" key={i}>
                    <FileInput
                      label={t("ATTACHMENT")}
                      name={`documents[${i}]`}
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                      allowedSizeInByte={3145728}
                      formik={form}
                    />
                    <Button
                      variant="link"
                      className="text-danger p-0 mt-2"
                      onClick={() =>
                        form.setValues({
                          ...form.values,
                          documents: [],
                        })
                      }
                    >
                      <i className="bi bi-trash me-1"></i>
                      {t("REMOVE_DOC")}
                    </Button>
                  </div>
                ))
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    form.setValues({
                      ...form.values,
                      documents: [
                        ...(form.values?.documents || []),
                        { ...new DocumentEntity(), type: "document" },
                      ],
                    })
                  }
                >
                  <i className="bi bi-paperclip me-2"></i>
                  {t("ATTACH_DOCS")}
                </Button>
              )}
            </Col>
          </Row>

          <Row className="mt-4">
            <Col className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid()}
                size="lg"
                className="px-4"
              >
                {form.isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {t("SUBMITTING")}
                  </>
                ) : (
                  t("SUBMIT_SUPPORT")
                )}
              </Button>
            </Col>
          </Row>
        </form>
      </Card.Body>
    </Card>
  );
}
