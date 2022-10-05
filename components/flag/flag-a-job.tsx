import { useFormik } from "formik";
import { toast } from 'react-toastify'
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { useTranslation } from "../../hooks/useTranslation";
import BaseInput from "../forms/BaseInput";
import { useAuth } from '../../hooks/useAuth'
import { FlagInappropriateJobDto } from "../../models/support/flag-inappropriate-job.dto";
import { Row, Button, Col } from "react-bootstrap";
import ViewModal from "../viewDetails/viewModal";
import { FlagFill } from "react-bootstrap-icons";
import { useState } from "react";
import BaseSelect from "../forms/BaseSelect";
import { FlagInappropriateJob } from "../../enums/jobs/flag-inappropriate-job.enum";
import SupportApi from "../../pages/api/support";

export default function FlagJob({ jobId }) {

    const { user } = useAuth();
    if (!!!user || user.company !== null) return <></>;

    const { t } = useTranslation();
    const supportApi = new SupportApi();

    const [showFlagJobModel, setShowFlagJobModel] = useState<boolean>(false);
    const openFlagJobModel = (): void => setShowFlagJobModel(true)
    const closeFlagJobModel = (): void => setShowFlagJobModel(false)

    const form = useFormik({
        initialValues: new FlagInappropriateJobDto({ jobId }),
        validationSchema: FlagInappropriateJobDto.yupSchema(),
        onSubmit: async (dto, { resetForm }) => {

            try {
                const data = await supportApi.FlagInappropriateJob(dto);
                toast.success(t("THANKS_FOR_KEEPING_A_WATCHFUL_EYE"));
                closeFlagJobModel()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_EMAIL" });
            }
        }
    });

    return (
        <>
            <div className="driver-flag" onClick={openFlagJobModel}>
                <p>
                    < FlagFill /> <span>{t("FLAG_INAPPROPRIATE")} </span>
                </p>
            </div>
            <ViewModal
                show={showFlagJobModel}
                onCloseClick={closeFlagJobModel}
                closeText="CANCEL"
                title="FLAG_INAPPROPRIATE_JOB"
            >

                <form onSubmit={form.handleSubmit}>
                    <Row>
                        <BaseSelect
                            className="col"
                            label="REASON"
                            name="type"
                            required
                            placeholder
                            labelPrefix="FlagInappropriateJob"
                            enumType={FlagInappropriateJob}
                            formik={form}
                        />
                        {
                            form.values.type === FlagInappropriateJob.OTHER &&
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