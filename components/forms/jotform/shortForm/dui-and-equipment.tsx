import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import JotformContext, {
    JotFormContextType,
} from "../../../../context/jotform-context";
import { JobEquipmentType } from "../../../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExperienceEntity } from "../../../../models/applicant";
import styles from "../../../../styles/digitalhiringapp.module.css";
import ViewCard from "../../../view-details/view-card";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";

export function DuiAndEquipment() {
    const {
        state: { applicant },
        method: { setApplicant, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {
            equipment_experience: [],
        },
        validationSchema: yup.object({
            equipment_experience: (
                yup.array(ApplicantExperienceEntity.yupSchema()) as any
            ).unique("type", { mapper: ApplicantExperienceEntity.key }),
            has_past_dui: yup.bool().nullable(),
            dui_years: yup
                .array(
                    yup
                        .number()
                        .min(new Date().getFullYear() - 5)
                        .max(new Date().getFullYear())
                )
                .nullable(),
        }),
        onSubmit: ({ equipment_experience }) => {
            setApplicant({
                ...applicant,
                equipment_experience,
            });
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffect(() => {
        const { equipment_experience } = applicant;

        form.setValues({
            ...form.values,
            equipment_experience,
        });
    }, [applicant]);

    return (
        <>
            <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("EQUIPMENT_DRIVEN")}</h1>
            <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                <Row>
                    <ViewCard
                        title="equipment_experience"
                        actions={
                            <Button
                                size="sm"
                                onClick={() =>
                                    form.setValues({
                                        ...form.values,
                                        equipment_experience: [
                                            ...(form.values?.equipment_experience || []),
                                            new ApplicantExperienceEntity(),
                                        ],
                                    })
                                }
                            >
                                <PlusCircle /> {t("ADD")}
                            </Button>
                        }
                    >
                        {form.values?.equipment_experience?.length > 0 && (
                            <>
                                {form.values?.equipment_experience.map((entity, i) => (
                                    <Row key={i}>
                                        <div className="col-md-6 mt-2">
                                            <Col className="p-0">
                                                <strong>{t("TYPE")}</strong>
                                            </Col>
                                            <BaseSelect
                                                name={`equipment_experience[${i}].type`}
                                                placeholder="TYPE"
                                                labelPrefix="JobEquipmentType"
                                                enumType={JobEquipmentType}
                                                formik={form}
                                            />
                                        </div>
                                        <div className="col-md-5 mt-2">
                                            <Col className="p-0">
                                                <strong>{t("YEARS")}</strong>
                                            </Col>
                                            <BaseInput
                                                name={`equipment_experience[${i}].years`}
                                                placeholder="PLACEHOLDER_FOR_DIGITS"
                                                type="int"
                                                min="1"
                                                formik={form}
                                            />
                                        </div>
                                        {entity.type == JobEquipmentType.OTHER && (
                                            <div>
                                                <BaseInput
                                                    className="my-2"
                                                    name={`equipment_experience[${i}].type_other`}
                                                    placeholder="TYPE"
                                                    formik={form}
                                                />
                                            </div>
                                        )}
                                        <div className="pl-sm-1 pt-lg-2 col-lg-1 col-md-12">
                                            <Col className="mt-4"></Col>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    form.setValues({
                                                        ...form.values,
                                                        equipment_experience:
                                                            form.values?.equipment_experience?.filter(
                                                                (v, idx) => i != idx
                                                            ),
                                                    })
                                                }
                                            >
                                                <DashCircle color="red" />
                                            </a>
                                        </div>
                                        <div className="12">
                                            <hr />
                                        </div>
                                    </Row>
                                ))}
                            </>
                        )}
                    </ViewCard>
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
