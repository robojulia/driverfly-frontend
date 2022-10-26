import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import BaseCheck from "../../base-check";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";



export interface FourthPageProps{
    onNextClick: (any) => void;
    onBackClick: () => void;
}


export function FourthPage(props: FourthPageProps) {
    const { t } = useTranslation();
    
    const form = useFormik({
        initialValues: {
            license_type: null,
            years_cdl_experience:null,
            is_owner_operator_question:false
        },
        validationSchema: yup.object({
            license_type: yup.string().when({
                is: value => !!value,
                then: yup.string().oneOf(Object.values(DriverLicenseType))
            }).nullable(),
            years_cdl_experience: yup.number().when("license_type",{
                is: value => !!value,
                then: yup.number().moreThan(0).required()
            }).nullable(),
            is_owner_operator_question: yup.boolean().nullable()
        }),
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset:(values) => {
            props.onBackClick();
        }
    })
  
    function onLicenseTypeChange(e: React.ChangeEvent<HTMLSelectElement>){
        
        const licenseType = e.target.value;
        switch(licenseType){
            case DriverLicenseType.CDL_CLASS_C:
                form.setValues({
                    ...form.values,
                    license_type: licenseType,
                    is_owner_operator_question: false
                })
                break;
            case null:
                form.setValues({
                    ...form.values,
                    license_type: licenseType,
                    is_owner_operator_question:false,
                    years_cdl_experience: null
                })
                break;
            default:
                form.setValues({
                    ...form.values,
                    license_type: licenseType
                })
                break;

            
        }
    }

    return (
        <>
            <Form onSubmit={form.handleSubmit}
                    onReset={form.handleReset}>
                <Row className="mb-4">
                    <BaseSelect
                        className="col-6"
                        label="CDL_CLASS"
                        placeholder="DriverLicenseType.NONE"
                        name="license_type"
                        required
                        labelPrefix="DriverLicenseType"
                        enumType={DriverLicenseType}
                        formik={form}
                        onChange={onLicenseTypeChange}
                    />
                </Row>
                {!!form.values.license_type &&  (
                    <>
                    <Row className="mt-3 mb-3">
                    <BaseInput
                    className="col-6"
                    required
                    type="number"
                    step={0.1}
                    min={0.1}
                    name="years_cdl_experience"
                    label="Years of CDL Experience"
                    placeholder="ex:2.5"
                    formik={form}
                    />
                </Row>
                <Row>
                    <BaseCheck
                    className="mt-3 mb-3"
                    required
                    name="is_owner_operator_question"
                    label="Are you an owner operator looking to be hired?"
                    formik={form}
                    />
                </Row>
                </>
                )}
                
                <Row className="mt-3">
                    <Col>
                        <Button className="float-right"
                        type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>
                    <Col>
                        <Button className="float-left"
                        type="submit">
                            {t("NEXT")}
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>

    )
}
