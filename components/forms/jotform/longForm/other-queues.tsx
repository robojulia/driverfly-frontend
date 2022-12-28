import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { OtherQueuesDto } from "../../../../models/jot-form/long-form/other-queues.dto";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { CdlExtras } from "../../../../models/jot-form/long-form/cdl-object/index.dto";
import BaseCheckList from "../../base-check-list";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import StateSelect from "../../state-select";

export function OtherQueues() {

    const {
        state: { applicant, applicantExtras },
        method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: new OtherQueuesDto(),
        validationSchema: OtherQueuesDto.yupSchema(),
        onSubmit: (values) => {
            try {
                console.log("valuesDTO", values);
                const { endorsements, QUALIFIED_FOR_MANUAL_TRANSMISSION, CDL_NUMBER } =
                    values;

                setApplicant({
                    ...applicant,
                    endorsements,
                });

                updateApplicantExtras(QUALIFIED_FOR_MANUAL_TRANSMISSION);
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
        const { endorsements } = applicant;
        const apx_qualified = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.QUALIFIED_FOR_MANUAL_TRANSMISSION
        );
        const apx_cdl = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.CDL_NUMBER
        );
        form.setValues({
            ...form.values,
            QUALIFIED_FOR_MANUAL_TRANSMISSION: !!apx_qualified?.type
                ? apx_qualified
                : new ApplicantExtrasEntity(
                    ApplicantExtras.QUALIFIED_FOR_MANUAL_TRANSMISSION
                ),
            CDL_NUMBER: !!apx_cdl?.type
                ? apx_cdl
                : new ApplicantExtrasEntity(ApplicantExtras.CDL_NUMBER),
            endorsements: endorsements || null,
        });
    }, [applicant, applicantExtras]);

    return (
        <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
            <Row>
                <BaseSelect
                    className={`${styles.bold} col-12 my-3`}
                    labelPrefix="BooleanType"
                    enumType={BooleanType}
                    name="QUALIFIED_FOR_MANUAL_TRANSMISSION.value"
                    placeholder="CHOOSE"
                    label="QUALIFIED_TO_MANUAL_DRIVING"
                    formik={form}
                />
                <BaseCheckList
                    className="col-12"
                    label="ENDORSEMENTS"
                    name="endorsements"
                    labelPrefix="DriverEndorsement"
                    enumType={DriverEndorsement}
                    formik={form}
                    cols="2"
                />
            </Row>
            {form.values.CDL_NUMBER?.value?.length > 0 && (
                <>
                    {form.values.CDL_NUMBER?.value?.map((entity, i) => (
                        <Row key={i} className={`${styles.bold} single-past-employer-items my-3`}>
                            <BaseInput
                                name={`CDL_NUMBER.value[${i}].license_number`}
                                className="col-md-4 my-3"
                                placeholder="CDL_NUMBER_1"
                                label="CDL_NUMBER"
                                formik={form}
                            />
                            <StateSelect
                                className="col-md-4 my-3"
                                name={`CDL_NUMBER.value[${i}].state`}
                                placeholder="STATE"
                                label="CHOOSE"
                                formik={form}
                            />
                            <BaseInput
                                className="col-md-4 my-3"
                                type="date"
                                name={`CDL_NUMBER.value[${i}].date`}
                                placeholder="expiration_date"
                                label="DATE"
                                formik={form}
                            />

                            <Button className="rounded-0 col"
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
                <div className="mt-4 float-left d-flex justify-left p-0">
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
    );
}
