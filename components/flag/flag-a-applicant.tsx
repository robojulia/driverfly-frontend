import { useFormik } from "formik";
import { toast } from 'react-toastify'
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
import SupportApi from "../../pages/api/support";

export default function FlagApplicant({ applicantId }) {

    const { user } = useAuth();
    if (!!!user || user.company === null) return <></>;

    const { t } = useTranslation();
    const supportApi = new SupportApi();

    const [showFlagApplicantModel, setShowFlagApplicantModel] = useState<boolean>(false);
    const openFlagApplicantModel = (): void => setShowFlagApplicantModel(true)
    const closeFlagApplicantModel = (): void => setShowFlagApplicantModel(false)

    const form = useFormik({
        initialValues: new FlagInappropriateApplicantDto(applicantId),
        validationSchema: FlagInappropriateApplicantDto.yupSchema(),
        onSubmit: async (dto, { resetForm }) => {
            try {
                await supportApi.FlagInappropriateApplicantApi(dto);
                toast.success(t("THANKS_FOR_KEEPING_A_WATCHFUL_EYE_TO_OUR_SAFETY"));
                resetForm()
                closeFlagApplicantModel()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_EMAIL" });
            }
        }
    });

    return (
        <>
            <div className="driver-flag" onClick={openFlagApplicantModel}>
                <p>
                    < FlagFill /> <span>{t("FLAG_INAPPROPRIATE")} </span>
                </p>
            </div>
            <ViewModal
                show={showFlagApplicantModel}
                onCloseClick={closeFlagApplicantModel}
                closeText="CANCEL"
                title="FLAG_INAPPROPRIATE_APPLICANT"
            >
                <form onSubmit={form.handleSubmit}>
                    <Row>
                        <BaseSelect
                            className="col"
                            label="INAPPROPRIATE_APPLICANT"
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