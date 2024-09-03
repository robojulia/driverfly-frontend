import { Col, Row } from "react-bootstrap";
import { formatDate } from "../../../../../components/jobs/show-formatted-date";
import ViewCard from "../../../../../components/view-details/view-card";
import ViewDetails from "../../../../../components/view-details/view-details";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEmployerEntity, ApplicantEntity, ApplicantVoeEntity } from "../../../../../models/applicant";
import ApplicantApi from "../../../../api/applicant";
import styles from "../../../../../styles/voe.module.css";

export interface VoeFormProps {
    applicant: ApplicantEntity;
    employer: ApplicantEmployerEntity;
    voeData: ApplicantVoeEntity;
}

export default function ViewVoeForm({ applicant, employer, voeData }: VoeFormProps) {

    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.main__voe_form}>
                    <Row>
                        <h4 className={styles.carrierName}>{t("VOE_SUBMIT_DETAILS")}</h4>
                    </Row>
                    <Row>
                        <span className="text-black my-3 text-center">
                            {t("VERIFICATION_OF_{APPLICANT_NAME}_BY_{EMPLOYER_NAME}", {
                                APPLICANT_NAME: `${applicant?.first_name} ${applicant?.last_name}`,
                                EMPLOYER_NAME: `${employer?.name}`,
                            })}
                        </span>
                    </Row>
                    <ViewCard title="BASIC_QUESTIONAIRE">
                        <ViewDetails
                            default={t("NOT_ANSWERED")}
                            obj={{
                                EMPLOYED_BY_US: Boolean(voeData?.was_employed) ? t("YES") : t("NO"),
                                VOE_DRIVER_QUES: Boolean(voeData?.drived_vehicle) ? t("YES") : t("NO"),
                                SAFETY_PERFORMANCE_REPORT: Boolean(voeData?.safety_performance)
                                    ? t("YES")
                                    : t("NO"),
                                ACCIDENT_REGISTER: Boolean(voeData?.registered_accidents_details) ? t("YES") : t("NO"),
                            }}
                        />
                    </ViewCard>
                    <ViewCard title="WAS_EMPLOYED_AS">
                        {console.log("voeData?.end_date", voeData?.end_date)
                        }
                        <ViewDetails
                            obj={{
                                POSITION: voeData?.position || t('N/A'),
                                START_DATE: voeData?.start_date ? formatDate(voeData?.start_date, true) : t('N/A'),
                                END_DATE: voeData?.end_date ? formatDate(voeData?.end_date, true) : t('N/A'),
                            }}
                        />
                    </ViewCard>

                    <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
                        <label className={`${styles.bold}`}>{t("VEHICLE_TYPE")}</label>
                        <Col className={`${styles.align__text_left} ${styles.paragraph}`}>
                            <p>{voeData?.drived_vehicle ?? t('N/A')}</p>
                        </Col>
                    </Row>

                    {Boolean(voeData?.registered_accidents_details) &&
                        <Row className={`${styles.align__text_left}${styles.paragraph}`}>
                            <label className={`${styles.bold}`}>
                                {t("ACCIDENTS_REPORTED_TO_GOVERNMENT")}
                            </label>
                            <Col className={`${styles.align__text_left}  ${styles.paragraph}`}>
                                <p>{voeData?.accidents_reported_to_government ?? t('N/A')}</p>
                            </Col>
                        </Row>
                    }

                    <ViewCard title="SUBMISSION_DETAILS">
                        <ViewDetails
                            obj={{
                                REASON_TO_LEAVE_EMPLOYMENT: t(voeData?.reason_to_leave ? `ReasonsForLeavingEmployment.${voeData?.reason_to_leave}` : "N/A"),
                                FULL_NAME: voeData?.focal_person_name,
                                title: voeData?.focal_person_title,
                                phone: voeData?.focal_person_phone,
                                email: voeData?.focal_person_email,
                                DATE: formatDate(voeData?.signed_date),
                            }}
                        />
                    </ViewCard>

                    <Row className={`${styles.align__text_left}`}>
                        <label className={`${styles.bold} text-black`}>{t("SIGNATURE")}</label>
                        <Col className="">
                            <img
                                src={voeData?.signature}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    border: "1px solid black",
                                }}
                                alt="No Signature"
                            />
                        </Col>
                    </Row>

                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, employer_uuid } = query || {};

        if (!!!applicant_uuid || !!!employer_uuid) return { notFound: true }

        const applicantApi = new ApplicantApi()

        const applicant: ApplicantEntity = await applicantApi.fetchByUuidToken(
            applicant_uuid,
            {
                withRelations: [
                    "company",
                    "employers",
                    "employers.voeData",
                ]
            })
        const employer: ApplicantEmployerEntity = applicant.employers?.find(({ uuid_token }) => uuid_token == employer_uuid)

        if (!!!applicant || !!!employer || applicant.id != employer.applicant.id) return { notFound: true }

        const voeData = employer.voeData || new ApplicantVoeEntity();

        return { props: { applicant, employer, voeData } }
    } catch (error) {
        return { notFound: true }
    }
}
