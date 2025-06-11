import { useState } from "react";
import { Button, Row } from "react-bootstrap";
import styles from "../../../styles/digitalhiringapp.module.css";
import { ApplicantFormStatus } from "../../../enums/applicants/applicant-form-status.enum";
import { useTranslation } from "../../../hooks/use-translation";
import ApplicantApi from "../../api/applicant";

export interface ApplicantHireStatusProps {
  applicant_uuid: string,
  hired: number
}
export default function ApplicantHireStatusPage({ applicant_uuid }) {
  const [toggle, setToggle] = useState<boolean>(false)
  const applicantApi = new ApplicantApi();
  const { t } = useTranslation();

  const handleHireStatus = async (status: boolean): Promise<void> => {

    await applicantApi.jotform.mark(
      applicant_uuid,
      Boolean(status)
        ? ApplicantFormStatus.HIRED
        : ApplicantFormStatus.REJECTED
    );
    setToggle(true)
  }
  return (
    <>
      {
        Boolean(toggle) ? (
          <div className={styles.container}>
            <div className={styles.main}>
              <div className={styles.main_form} >
                <h4 className={styles.Application}>{t("THANK_YOU")}</h4>
                <h6 className={styles.paragraph}>{t("successfully_saved_information")}</h6>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.main}>
              <div className={styles.main_form} >
                <Row>
                  <h4 className={styles.heading__sty}>
                    <h6 className={styles.Application}>{t("MARK_SURE_ALERT")}</h6>
                  </h4>
                </Row>
                <Row className="mt-3">
                  <div className="d-flex justify-content-center">
                    <Button type="submit" className="w-25 mr-2" onClick={() => handleHireStatus(false)}>
                      {t("no")}
                    </Button>
                    <Button type="submit" className="w-25 ml-2" onClick={() => handleHireStatus(true)}>
                      {t("yes")}
                    </Button>
                  </div>
                </Row>
              </div>
            </div>
          </div>

        )
      }

    </>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const { applicant_uuid } = query || {};

    if (!!!applicant_uuid) return { notFound: true };

    return { props: { applicant_uuid } };
  } catch (error) {
    console.log("error:: ", error.message);
    return { notFound: true };
  }
}

