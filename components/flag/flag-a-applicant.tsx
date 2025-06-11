import { useFormik } from "formik";
import { toast } from 'react-toastify'
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { useTranslation } from "../../hooks/use-translation";
import BaseInput from "../forms/base-input";
import { useAuth } from '../../hooks/use-auth'
import { Row, Button, Col } from "react-bootstrap";
import ViewModal from "../view-details/view-modal";
import { FlagFill } from "react-bootstrap-icons";
import { useState } from "react";
import BaseSelect from "../forms/base-select";
import { FlagInappropriateApplicantDto } from "../../models/support/flag-inappropriate-applicant.dto";
import SupportApi from "../../pages/api/support";
import { InappropriateApplicantFlag } from "../../enums/support/inappropriate-applicant-flag.enum"

export default function FlagApplicant({ applicantId }) {

    const { user } = useAuth();
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
                await supportApi.FlagInappropriateApplicant(dto);
                toast.success(t("THANKS_FOR_KEEPING_A_WATCHFUL_EYE_TO_OUR_SAFETY"));
                closeFlagApplicantModel()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_EMAIL" });
            }
        }
    });

    if (!!!user || user.company == null) return <></>;

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
                            displayPlaceholder
                            labelPrefix="InappropriateApplicantFlag"
                            enumType={InappropriateApplicantFlag}
                            formik={form}
                        />
                        {
                            form.values.type == InappropriateApplicantFlag.OTHER &&
                            <BaseInput
                                className="col-12 mt-3"
                                label="other"
                                required
                                name="type_other"
                                displayPlaceholder
                                formik={form}
                            />
                        }
                    </Row>
                    <Row>
                        <Col className="text-end my-3">
                            <Button
                                disabled={form.isSubmitting || !form.isValid || form.isValidating}
                                type="submit">{t("submit")}
                            </Button>
                        </Col>
                    </Row>
                </form>
            </ViewModal>
        </>
    )
}