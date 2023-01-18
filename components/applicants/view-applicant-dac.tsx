
import { Table } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import { ApplicantDac } from "../../enums/applicants/applicant-dac.enum";
import ViewCard from "../view-details/view-card";
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { ApplicantDacEntity } from "../../models/applicant/applicant-dac.entity";
import BaseCheck from "../forms/base-check";

export interface ApplicantDacProps extends ViewApplicantDetailProps { }

const ViewApplicantDAC = ({ applicant }: ApplicantDacProps, type: any, dac?: ApplicantDacEntity) => {

    const { t } = useTranslation();
    const data: ApplicantDacEntity = { type }
    if (dac) {
        data.id = dac.id
        data.value = dac.value
    }
    return (
        <>
            <ViewCard title={t("APPLICANT_DAC")}>
                <Table striped>
                    <tbody>
                        {
                            Object.values(ApplicantDac).map((value: ApplicantDac, i) => {
                                const dac: ApplicantDacEntity = applicant?.dac?.find(v => (v.type === value))
                                return (
                                    <tr key={i}>
                                        <td> {t(`ApplicantDac.${value}`)}</td>
                                        <td className="text-right">
                                            <BaseCheck
                                                readOnly
                                                disabled
                                                checked={dac?.type && dac.type == value && dac.value}
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