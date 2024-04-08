import { useFormik } from "formik";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FlagFill, Link } from "react-bootstrap-icons";
import { toast } from 'react-toastify';
import { InappropriateCompanyFlag } from "../../enums/support/inappropriate-company-flag.enum";
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from "../../hooks/use-translation";
import { FlagInappropriateCompanyDto } from "../../models/support/flag-inappropriate-company.dto";
import SupportApi from "../../pages/api/support";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import BaseInput from "../forms/base-input";
import BaseSelect from "../forms/base-select";
import ViewModal from "../view-details/view-modal";

export default function FlagCompany({ companyId }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const supportApi = new SupportApi();

    const [viewEncourageModal, setViewEncourageModal] = useState<boolean>(false)
    const openEncourageModal = (): void => setViewEncourageModal(true)
    const closeEncourageModal = (): void => setViewEncourageModal(false)

    const [viewFlagCompanyModel, setViewFlagCompanyModel] = useState<boolean>(false);
    const openFlagCompanyModel = (): void => setViewFlagCompanyModel(true)
    const closeFlagCompanyModel = (): void => setViewFlagCompanyModel(false)

    const handleFlagClick = (): void => {
        if (user == null) {
            openEncourageModal()
        }
        else {
            openFlagCompanyModel()
        }
    }
    const form = useFormik({
        initialValues: new FlagInappropriateCompanyDto(companyId),
        validationSchema: FlagInappropriateCompanyDto.yupSchema(),
        onSubmit: async (dto, { resetForm }) => {
            try {
                const data = await supportApi.FlagInappropriateCompany(dto);
                toast.success(t("THANKS_FOR_KEEPING_A_WATCHFUL_EYE"));
                closeFlagCompanyModel()
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
                    show={viewFlagCompanyModel}
                    onCloseClick={closeFlagCompanyModel}
                    closeText="CANCEL"
                    title="FLAG_INAPPROPRIATE_COMPANY"
                >
                    <form onSubmit={form.handleSubmit}>
                        <Row>
                            <BaseSelect
                                className="col"
                                label="REASON"
                                name="type"
                                required
                                displayPlaceholder
                                labelPrefix="InappropriateCompanyFlag"
                                enumType={InappropriateCompanyFlag}
                                formik={form}
                            />
                            {
                                form.values.type == InappropriateCompanyFlag.OTHER &&
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