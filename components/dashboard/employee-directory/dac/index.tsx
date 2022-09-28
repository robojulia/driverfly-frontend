
import { Col, Row, Table } from "react-bootstrap";
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
                <Row className="mt-3 mb-2">
                    
                    <Col className="text-right p-0">
                        <button type="button" className="theme-primary-btn mr-3 py-2">{t("ORDER_DAC")}</button>
                    </Col>
                </Row>
                <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>

                    <Table striped>
                        <thead>
                            <tr>
                                <th ></th>
                                <th ></th>
                            </tr>
                        </thead>

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