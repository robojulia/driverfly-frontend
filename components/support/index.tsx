import { useFormik } from "formik";
import SupportApi from "../../pages/api/support";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { globalAjaxExceptionHandler } from "../../utils/ajax";

// hooks
import { useTranslation } from "../../hooks/useTranslation";

// inputs
import BaseInput from "../forms/BaseInput";

import { SupportDto } from "../../models/support/support.dto";

import { Row, Button, Col } from "react-bootstrap";

export default function Support() {
    const { t } = useTranslation();
    const router = useRouter();
    const form = useFormik({
        initialValues: new SupportDto(),
        validationSchema: SupportDto.yupSchema(),
        onSubmit: async (dto) => {
            const api = new SupportApi();

            try {
                await api.ReportFlag(dto);
                toast.success(t("SUCCESSFULLY_TO_DEVELOPER"));
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_EMAIL" });
            }
        }
    });

    return (<>
        <form onSubmit={form.handleSubmit}>
            <Row>
                <BaseInput
                    className="col-6 mb-2"
                    label="bug"
                    name="bug"
                    placeholder="bug"
                    required
                    formik={form}
                />
                <BaseInput
                    className="col-6 mb-2"
                    label="operating_system"
                    name="operating_system"
                    placeholder="operating_system"
                    required
                    formik={form}
                />
                <BaseInput
                    className="col-6 mb-2"
                    label="page-path-url"
                    name="page_path_url"
                    placeholder="page-path-url"
                    required
                    formik={form}
                />
                 <BaseInput
                    className="col-6 mb-2"
                    label="ip_address"
                    name="ip_address"
                    placeholder="ip_address"
                    required
                    formik={form}
                />
            </Row>
            <Row>
                <Col className="text-end">
                    <Button disabled={form.isSubmitting} type="submit">{t("submit")}</Button>
                </Col>
            </Row>
        </form>
    </>);
}
