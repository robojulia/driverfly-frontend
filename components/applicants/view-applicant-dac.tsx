
import { Table } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import { ApplicantDac } from "../../enums/applicants/applicant-dac.enum";
import ViewCard from "../view-details/view-card";
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { ApplicantDacEntity } from "../../models/applicant/applicant-dac.entity";
import BaseCheck from "../forms/base-check";
import { ApplicantEntity } from "../../models/applicant";

export interface ApplicantDacProps {
    applicant: ApplicantEntity;
    dac?: ApplicantDacEntity
}

const ViewApplicantDAC = ({ applicant, dac }: ApplicantDacProps) => {

    const { t } = useTranslation();

    return (
        <>
            <ViewCard title={t("APPLICANT_DAC")}>
                <Table striped>
                    <tbody>
                        {
                            Object.values(ApplicantDac)?.map((value, i) => {
                                dac = applicant?.dac?.find(v => (v?.type === value))
                                return (
                                    <tr key={i}>
                                        <td> {t(`ApplicantDac.${value}`)}</td>
                                        <td className="text-right">
                                            <BaseCheck
                                                readOnly
                                                disabled
                                                checked={dac?.type && dac?.type == value && dac?.value}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </ViewCard>
        </>
    );
};

export default ViewApplicantDAC;