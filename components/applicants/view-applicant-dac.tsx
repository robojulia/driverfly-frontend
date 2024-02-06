
import { Table } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import { ApplicantDac } from "../../enums/applicants/applicant-dac.enum";
import ViewCard from "../view-details/view-card";
import { ApplicantDacEntity } from "../../models/applicant/applicant-dac.entity";
import BaseCheck from "../forms/base-check";
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";

export interface ApplicantDacProps extends ViewApplicantDetailProps { }

const ViewApplicantDAC = ({ applicant }: ApplicantDacProps) => {

    const { t } = useTranslation();

    return (
        <ViewCard title={t("APPLICANT_DRIVER_ONBOARDING_CHECKLIST")}>
            <Table striped>
                <tbody>
                    {
                        Object.values(ApplicantDac)?.map((value, i) => {
                            const dac: ApplicantDacEntity = applicant?.dac?.find(v => (v?.type == value))
                            return (
                                <tr key={i}>
                                    <td> {t(`ApplicantDac.${value}`)}</td>
                                    <td className="text-right">
                                        <BaseCheck
                                            readOnly
                                            disabled
                                            checked={
                                                Boolean(dac?.type)
                                                && dac?.type == value
                                                && Boolean(dac?.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </ViewCard>
    );
};

export default ViewApplicantDAC;