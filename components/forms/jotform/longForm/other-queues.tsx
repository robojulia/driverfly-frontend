import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { CdlExtras } from "../../../../models/jot-form/long-form/cdl-object/index.dto";
import { OtherQueuesDto } from "../../../../models/jot-form/long-form/other-queues.dto";
import BaseInput from "../../base-input";
import StateSelect from "../../state-select";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function OtherQueues() {

    const {
        state: { applicantExtras },
        method: { updateApplicantExtras, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();
    const current_date = new Date();


    const form = useFormik({
        initialValues: new OtherQueuesDto(),
        validationSchema: OtherQueuesDto.yupSchema(),
        onSubmit: (values) => {
            try {
                console.log("valuesDTO", values);
                const { CDL_NUMBER } = values;

                updateApplicantExtras(CDL_NUMBER);
            } catch (error) { }
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffect(() => {
        console.log("applicant extras", applicantExtras);
        const apx_cdl = applicantExtras?.find(
            (v) => v.type == ApplicantExtras.CDL_NUMBER
        );
        form.setValues({
            ...form.values,
            CDL_NUMBER: !!apx_cdl?.type
                ? apx_cdl
                : new ApplicantExtrasEntity(ApplicantExtras.CDL_NUMBER),
        });
    }, [applicantExtras]);

    return (
        <>
            <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("HAVE_ANY_ACTIVE_DRIVERS_LICENSE")}</h1>
            <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                {form.values.CDL_NUMBER?.value?.length > 0 && (
                    <>
                        {form.values.CDL_NUMBER?.value?.map((entity, i) => (
                            <Row key={i} className={`${styles.bold} single-past-employer-items my-3`}>
                                <BaseInput
                                    name={`CDL_NUMBER.value[${i}].license_number`}
                                    className="col-md-4 my-3"
                                    placeholder="driver's_license_number"
                                    label="driver's_license_number"
                                    required
                                    formik={form}
                                />
                                <StateSelect
                                    className="col-md-4 my-3"
                                    name={`CDL_NUMBER.value[${i}].state`}
                                    placeholder="SELECT_STATE"
                                    label="state_issued"
                                    required
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-md-4 my-3"
                                    type="date"
                                    name={`CDL_NUMBER.value[${i}].date`}
                                    placeholder="expiration_date"
                                    min={(new Date(current_date.getFullYear(), current_date.getMonth() + 6, current_date.getDate())).toISOString().split("T")[0]}
                                    label="expiration_date"
                                    required
                                    formik={form}
                                />

                                <Button
                                    className="rounded-lg"
                                    variant="outline-danger close_btn w-25 mx-auto my-2"
                                    onClick={() =>
                                        form.setValues({
                                            ...form.values,
                                            CDL_NUMBER: {
                                                ...form.values.CDL_NUMBER,
                                                value: form.values.CDL_NUMBER?.value?.filter(
                                                    (v, idx) => i != idx
                                                ),
                                            },
                                        })
                                    }
                                >
                                    <DashCircle /></Button>
                                <div className='Row' style={{ height: '3px', borderBottom: 'solid 2px #8d8c8c', marginTop: '0px' }}></div >

                            </Row>
                        ))}

                    </>
                )}
                <Row>
                    <div className="mt-4 float-left d-flex justify-left">
                        <Button
                            className="w-100 py-2"
                            size="sm"
                            onClick={() =>
                                form.setValues({
                                    ...form.values,
                                    CDL_NUMBER: {
                                        ...form.values.CDL_NUMBER,
                                        value: [
                                            ...(form.values.CDL_NUMBER?.value || []),
                                            new CdlExtras(),
                                        ],
                                    },
                                })
                            }
                        >
                            <PlusCircle /> {t("TITLE_ADD_CDL_DETAIL")}
                        </Button>
                    </div>
                </Row>


                <Row className="mt-4">
                    <Col>
                        <Button className="float-right" type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>

                    <Col>
                        <Button className="float-left" type="submit">
                            {t("NEXT")}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
