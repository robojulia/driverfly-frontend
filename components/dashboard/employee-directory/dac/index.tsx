
import { Button, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ApplicantDac } from "../../../../enums/applicants/applicant-dac.enum";
import ViewCard from "../../../viewDetails/viewCard";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";

export interface DacTabProps extends ViewApplicantDetailProps { }

const DAC = ({ applicant }: DacTabProps) => {
    const { t } = useTranslation();


    return (
        <>
            <div className="employee_directory_tabs">
              
                <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`} actions={<Button>Submit</Button>}>

                    <Table striped>
                        <tbody>
                            {
                                Object.values(ApplicantDac).map((value: ApplicantDac, i) => {
                                    return (
                                        <tr key={i}>
                                            <td> {t(`ApplicantDac.${value}`)}</td>
                                            <td>
                                                <div className="custom_input_style">
                                                    <input type="checkbox" />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </ViewCard>
            </div>
        </>
    );
};

export default DAC;