import { useFormik } from "formik";
import FlagInappropriateJobApi from "../../pages/api/flag-inappropriate-job";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { globalAjaxExceptionHandler } from "../../utils/ajax";
// hooks
import { useTranslation } from "../../hooks/useTranslation";
// inputs
import BaseInput from "../forms/BaseInput";

// useAuth
import { useAuth } from '../../hooks/useAuth'

import { FlagInappropriateJobDto } from "../../models/flag-inappropriate-job/flag-inappropriate-job.dto";

import { Row, Button, Col } from "react-bootstrap";
import ViewModal from "../viewDetails/viewModal";
import { FlagFill } from "react-bootstrap-icons";
import { useState } from "react";
import BaseSelect from "../forms/BaseSelect";
import { FlagInappropriateJob } from "../../enums/jobs/flag-inappropriate-job.enum";

export default function DriverFlag({ jobId }) {

    const { user } = useAuth();
    if (!!!user) return <></>;

    const { t } = useTranslation();
    const router = useRouter();
    const form = useFormik({
        initialValues: new FlagInappropriateJobDto(jobId),
        validationSchema: FlagInappropriateJobDto.yupSchema(),
        onSubmit: async (dto) => {
            const api = new FlagInappropriateJobApi();

            try {
                await api.FlagInappropriateJob(dto);
                toast.success(t("THANKS_FOR_KEEPING_A_WATCHFUL_EYE"));
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_EMAIL" });
            }
        }
    });
    // showDriverFlagModel 
    const [showDriverFlagModel, setShowDriverFlagModel] = useState<boolean>(false);
    const openFileUploadModel = (): void => setShowDriverFlagModel(true)
    const closeDriverFlagModel = (): void => setShowDriverFlagModel(false)

    return (
        <>
            <div className="driver-flag" onClick={openFileUploadModel}>
                <p>
                    < FlagFill /> <span>{t("flag_inappropriate")} </span>
                </p>
            </div>
            <ViewModal
                show={showDriverFlagModel}
                onCloseClick={closeDriverFlagModel}
                closeText="CANCEL"
                title="flag_inappropriate"
            >

                <form onSubmit={form.handleSubmit}>
                    <Row>
                        <BaseSelect
                            className="col"
                            label="Flag_Inappropriate_Job"
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
                                name="other_options"
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