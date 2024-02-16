
import { Button, Form, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantDac } from "../../../../enums/applicants/applicant-dac.enum";
import ViewCard from "../../../view-details/view-card";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { useFormik } from "formik";
import { ApplicantDacEntity } from "../../../../models/applicant/applicant-dac.entity";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { toast } from "react-toastify";
import BaseCheck from "../../../forms/base-check";

export interface DacTabProps extends ViewApplicantDetailProps { }

export default function DAC({ applicant }: DacTabProps) {

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
                    applicant.dac = applicant.dac.filter(v => (v.id != dac.id))
                } else {
                    dac = await applicantApi.dac.create(applicant.id, values)
                }

                applicant.dac.push(dac)
                toast.success(t('SUCCESSFULLY_UPDATED_DAC'))
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
        <div className="employee_directory_tabs">

            <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>

                <Table striped>
                    <tbody>
                        {
                            Object.values(ApplicantDac).map((value: ApplicantDac, i) => {
                                const dac: ApplicantDacEntity = applicant?.dac?.find(v => (v.type == value))
                                return (
                                    <tr key={i}>
                                        <td> {t(`ApplicantDac.${value}`)}</td>
                                        <td>
                                            <div className="w-100">
                                                {
                                                    (form.values.type != value) ? (
                                                        <div className="d-flex justify-content-between">
                                                            <BaseCheck
                                                                readOnly
                                                                disabled
                                                                checked={dac?.type && dac.type == value && dac.value}
                                                            />
                                                            <Button
                                                                className="ml-2 w-50"
                                                                disabled={form.isSubmitting || !form.isValid || form.isValidating}
                                                                onClick={() => { handleChangeClick(value, dac) }}
                                                            >
                                                                {t('CHANGE')}
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Form onSubmit={form.handleSubmit} >
                                                            <BaseCheck
                                                                name={`value`}
                                                                formik={form}
                                                            />
                                                            <div className="d-flex justify-content-end w-100" >
                                                                <Button disabled={form.isSubmitting || !form.isValid || form.isValidating} className=" theme-primary-btn" type="submit">
                                                                    {t(`SAVE`)}
                                                                </Button>
                                                                <Button type="button" className="ml-2 bg-danger" onClick={() => { form.resetForm() }}                                                            >
                                                                    {t(`CANCEL`)}
                                                                </Button>
                                                            </div>
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
    );
};