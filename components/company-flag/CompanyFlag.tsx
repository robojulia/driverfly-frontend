import { useFormik } from "formik";
import FlagInappropriateApplicantApi from "../../pages/api/flag-inappropriate-applicant";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { useTranslation } from "../../hooks/useTranslation";
import BaseInput from "../forms/BaseInput";
import { useAuth } from '../../hooks/useAuth'
import { Row, Button, Col } from "react-bootstrap";
import ViewModal from "../viewDetails/viewModal";
import { FlagFill } from "react-bootstrap-icons";
import { useState } from "react";
import BaseSelect from "../forms/BaseSelect";
import { FlagInappropriateApplicantDto } from "../../models/flag-inappropriate-applicant/flag-inappropriate-applicant.dto";
import { FlagInappropriateApplicant } from "../../enums/jobs/flag-inappropriate-applicant.enum";

export default function CompanyFlag({ applicantId }) {

    const { user } = useAuth();

    const { t } = useTranslation();
    const router = useRouter();
    const form = useFormik({
        initialValues: new FlagInappropriateApplicantDto(applicantId),
        validationSchema: FlagInappropriateApplicantDto.yupSchema(),
        onSubmit: async (dto) => {
            const api = new FlagInappropriateApplicantApi();

            try {
                await api.FlagInappropriateApplicantApi(dto);
                toast.success(t("THANKS_FOR_KEEPING_A_WATCHFUL_EYE_TO_OUR_SAFETY"));
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_EMAIL" });
            }
        }
    });
    // showApplicantFlagModel 
    const [showApplicantFlagModel, setShowApplicantFlagModel] = useState<boolean>(false);
    const openApplicantFlagModel = (): void => setShowApplicantFlagModel(true)
    const closeApplicantFlagModel = (): void => setShowApplicantFlagModel(false)

    return (
        <>
            <div className="driver-flag" onClick={openApplicantFlagModel}>
                <p>
                    < FlagFill /> <span>{t("flag_inappropriate")} </span>
                </p>
            </div>
            <ViewModal
                show={showApplicantFlagModel}
                onCloseClick={closeApplicantFlagModel}
                closeText="CANCEL"
                title="Flag_Inappropriate_Applicant"
            >

                <form onSubmit={form.handleSubmit}>
                    <Row>
                        <BaseSelect
                            className="col"
                            label="Inappropriate_Applicant"
                            name="type"
                            required
                            placeholder
                            labelPrefix="FlagInappropriateApplicant"
                            enumType={FlagInappropriateApplicant}
                            formik={form}
                        />
                        {
                            form.values.type === FlagInappropriateApplicant.OTHER &&
                            <BaseInput
                                className="col-12 mt-3"
                                label="other"
                                required
                                name="type_other"
                                placeholder
                                formik={form}
                            />
                        }
                    </Row>
                    <Row>
                        <Col className="text-end my-3">
                            <Button disabled={form.values.type == null} type="submit">{t("submit")}</Button>
                        </Col>
                    </Row>
                </form>
            </ViewModal>

        </>
    )
}