import { Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import ViewCard from '../view-details/view-card';
import ViewDetails from '../view-details/view-details';

interface ApplicantSafetyBackgroundProps extends ViewApplicantDetailProps { }

export default function ApplicantSafetyBackground({ applicant }: ApplicantSafetyBackgroundProps) {

    const { t } = useTranslation();

    return (
        <ViewCard title="SAFETY_BACKGROUND">
            <Row>
                <Col md="6">
                    <ViewDetails
                        default={t("NOT_ANSWERED")}
                        obj={{
                            CAN_PASS_DRUG_TEST: applicant.can_pass_drug_test,
                            HAS_DUIS: applicant.has_past_dui,
                            years_of_past_duis: {
                                show: !!applicant.has_past_dui,
                                text: applicant.dui_years
                            },
                            criminal_history_last_3_years: applicant.criminal_history,
                            accidents_last_5_years: applicant.accident_count,
                            voilations_in_last_3_years: applicant.moving_violations_count,
                            ALL_VIOLATION_IN_LAST_3_YEARS: applicant.all_violations_count,
                            accident_details: {
                                show: applicant.accident_count > 0,
                                text: applicant.accident_details
                            }
                        }}
                    />
                </Col>
                <Col md="6">
                    <ViewDetails
                        default={t("NOT_ANSWERED")}
                        obj={{
                            has_had_license_revoked: applicant.license_revoked,
                            license_revoked_details: {
                                label: "details",
                                show: !!applicant.license_revoked,
                                text: applicant.license_revoked_details
                            },
                            has_had_positive_drug_test: applicant.positive_drug_test,
                            failed_drug_test_details: {
                                label: "details",
                                show: !!applicant.positive_drug_test,
                                text: applicant.positive_drug_test_details
                            },
                        }}
                    />
                </Col>
            </Row>
        </ViewCard>
    )
}
