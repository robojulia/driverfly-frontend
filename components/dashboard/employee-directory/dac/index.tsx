
import { Button, Form, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ApplicantDac } from "../../../../enums/applicants/applicant-dac.enum";
import ViewCard from "../../../viewDetails/viewCard";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { useFormik } from "formik";
import { ApplicantDacEntity } from "../../../../models/applicant/applicant-dac.entity";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { toast } from "react-toastify";
import BaseCheck from "../../../forms/BaseCheck";
import Collapse from 'react-bootstrap/Collapse';

export interface DacTabProps extends ViewApplicantDetailProps { }

const DAC = ({ applicant }: DacTabProps) => {

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantDacEntity(),
        validationSchema: ApplicantDacEntity.yupSchema(),
        onSubmit: async (values, { resetForm }) => {

            try {
                let dac: ApplicantDacEntity;

                if (values.id) {
                    dac = await applicantApi.dac.update(applicant.id, values.id, values)
                    applicant.dac = applicant.dac.filter(v => (v.id !== dac.id))
                } else {
                    dac = await applicantApi.dac.create(applicant.id, values)
                }

                applicant.dac.push(dac)
                console.log("form valuesss", applicant, values, dac)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });
    const handleChangeClick = async (type: any, dac?: ApplicantDacEntity) => {
        const data: ApplicantDacEntity = { type }
        if (dac) {
            data.id = dac.id
            data.value = dac.value
        }
        form.setValues(data)
    }
    return (
        <>
            <div className="employee_directory_tabs">

                <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>

                    <Table striped>
                        <tbody>
                            {
                                Object.values(ApplicantDac).map((value: ApplicantDac, i) => {
                                    const dac: ApplicantDacEntity = applicant?.dac?.find(v => (v.type === value))
                                    return (
                                        <tr key={i}>
                                            <td> {t(`ApplicantDac.${value}`)}</td>
                                            <td>
                                                <div className="w-100">
                                                    {
                                                        (!form.values.type || form.values.type !== value) ? (
                                                            <div className="d-flex justify-content-between">
                                                            <BaseCheck
                                                                readOnly
                                                                disabled
                                                                checked={dac?.type && dac.type == value && dac.value}
                                                            />
                                                            <Button
                                                                className="ml-2 w-50"
                                                                onClick={() => { handleChangeClick(value, dac) }}
                                                               
                                                            >
                                                                {t('CHANGE')}
                                                            </Button>
                                                        </div>
                                                        ) : (
                                                            (form.values?.type === value) &&
                                                            <Form onSubmit={form.handleSubmit} >
                                                                <BaseCheck
                                                                    name={`value`}
                                                                    formik={form}
                                                                />
                                                                <Collapse in={form.values?.type === value} dimension="height">
                                                                    <div className="d-flex justify-content-end w-100 " >
                                                                        <Button className=" theme-primary-btn" type="submit">
                                                                            {t(`SAVE`)}
                                                                        </Button>
                                                                        <Button type="button" className="ml-2 bg-danger" onClick={() => { form.resetForm() }}                                                            >
                                                                            {t(`CANCEL`)}
                                                                        </Button>
                                                                    </div>
                                                                </Collapse>
                                                            </Form>
                                                        )
                                                      
                                                    }

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