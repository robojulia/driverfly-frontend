import { useFormik } from "formik";
import { toast } from 'react-toastify'
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { useTranslation } from "../../hooks/useTranslation";
import BaseInput from "../forms/BaseInput";
import { useAuth } from '../../hooks/useAuth'
import { FlagInappropriateJobDto } from "../../models/support/flag-inappropriate-job.dto";
import { Row, Button, Col } from "react-bootstrap";
import ViewModal from "../viewDetails/viewModal";
import { FlagFill, Link } from "react-bootstrap-icons";
import React, { useEffect, useState } from "react";
import BaseSelect from "../forms/BaseSelect";
import { InappropriateJobFlag } from "../../enums/support/inappropriate-job-flag.enum";
import SupportApi from "../../pages/api/support";

export default function FlagJob({ jobId }) {

    const { user } = useAuth();
    const { t } = useTranslation();
    const supportApi = new SupportApi();

    const [viewEncourageModal, setViewEncourageModal] = useState<boolean>(false)
    const openEncourageModal = (): void => setViewEncourageModal(true)
    const closeEncourageModal = (): void => setViewEncourageModal(false)


    const [showFlagJobModel, setShowFlagJobModel] = useState<boolean>(false);
    const openFlagJobModel = (): void => setShowFlagJobModel(true)
    const closeFlagJobModel = (): void => setShowFlagJobModel(false)

    const handleFlagClick = (): void => {
        if (user == null) {
            openEncourageModal()
        }
        else {
            openFlagJobModel()
        }
    }

    const form = useFormik({
        initialValues: new FlagInappropriateJobDto(jobId),
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
            {
                (!!!user || !!!user?.company) &&
                <div className="driver-flag" onClick={handleFlagClick}>
                    <p>
                        < FlagFill /> <span>{t("FLAG_INAPPROPRIATE")} </span>
                    </p>
                </div>
            }

            {
                (!!user && !!!user.company) &&
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
                                labelPrefix="InappropriateJobFlag"
                                enumType={InappropriateJobFlag}
                                formik={form}
                            />
                            {
                                form.values.type === InappropriateJobFlag.OTHER &&
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
            }

            {
                (!!!user) &&
                <ViewModal
                    show={viewEncourageModal}
                    onCloseClick={closeEncourageModal}
                    closeText="CANCEL"
                    title="DRIVERFLY"
                >
                    <Row>
                        <p>
                            {t('PLEASE_LOGIN_TO_INAPPROPRIATE_JOB_OR_COMPANY')}
                            <Link href="/login">
                                <a className='ml-1 primary '>{t("LOGIN")}</a>
                            </Link>
                        </p>
                    </Row>
                </ViewModal>
            }

        </>
    )
}
