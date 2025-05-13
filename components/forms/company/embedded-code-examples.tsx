import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import styles from "../../../styles/digitalhiringapp.module.css";
import { toast } from "react-toastify";

interface EmbeddedCodeExamplesProps {
  companyId: string | number;
}

interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export function EmbeddedCodeExamples({ companyId }: EmbeddedCodeExamplesProps) {
  const { t } = useTranslation();

  const getExamples = (id: string | number): CodeExample[] => [
    {
      title: "COMPANY_SPECIFIC_JOBS",
      description: "EMBED_COMPANY_JOBS_DESC",
      code: `<script 
  src="https://app.driverfly.co/js/cdl-script.js" 
  charset="UTF-8"
  companyId="${id}">
</script>`,
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("COPIED_TO_CLIPBOARD"));
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error(t("COPY_FAILED"));
    }
  };

  return (
    <div className="mt-4">
      <h4>{t("EMBED_CODE_EXAMPLES")}</h4>
      <p className="text-muted">{t("EMBED_CODE_INSTRUCTIONS")}</p>

      {getExamples(companyId).map((example, index) => (
        <Card key={index} className="mb-3">
          <Card.Header>
            <h5 className="mb-0">{t(example.title)}</h5>
          </Card.Header>
          <Card.Body>
            <p>{t(example.description)}</p>
            <div className="code-block position-relative bg-light p-3 rounded">
              <pre className="mb-0">
                <code>{example.code}</code>
              </pre>
              <button
                className="position-absolute top-0 end-0 btn btn-sm btn-primary m-2"
                onClick={() => copyToClipboard(example.code)}
                title={t("COPY_CODE")}
              >
                {t("COPY")}
              </button>
            </div>
          </Card.Body>
        </Card>
      ))}

      <Card className="mt-4 bg-light">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>{t("COMPANY_INFORMATION")}</h5>
              <p>
                <strong>{t("COMPANY_ID")}:</strong> {companyId}
              </p>
            </Col>
            <Col md={6}>
              <div className="d-flex flex-column">
                <h5>{t("NEED_HELP")}</h5>
                <p>{t("EMBED_HELP_TEXT")}</p>
                <a href="mailto:support@driverfly.co" className="text-primary">
                  support@driverfly.co
                </a>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
