import Link from "next/link"
import { PublicLayout } from "../components/layouts/public-layout";
import SignupStyle from "../public/css/signup.module.css"
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useFormik } from "formik";

import BaseInput from "../components/forms/base-input";
import BaseSelect from "../components/forms/base-select";
import BaseCheck from "../components/forms/base-check";
import BaseInputPhone from "../components/forms/base-input-phone";

import AuthApi from "./api/auth";

import { useTranslation } from "../hooks/use-translation";
import { Row, Col, Button } from "react-bootstrap"
import { globalAjaxExceptionHandler } from "../utils/ajax";
import { FbLeadsDto } from "../models/fb-leads.dto";
import { PublicPage } from "../components/layouts/public/public-page";
import FbLeadsApi from "./api/fb-leads";
import { useEffectAsync } from "../utils/react";


export default function Signup() {

    const router = useRouter();

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: new FbLeadsDto(),
        validationSchema: FbLeadsDto.yupSchema(),
        onSubmit: async (dto) => {
            const api = new FbLeadsApi();

            try {
                await api.fbLeads(dto);
                toast.success(t("SUCCESSFULLY_REGISTERED"));
                setTimeout(() => router.push('/login'), 3000);
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SIGNUP" });
            }
        }
    });
    //   Uncomment this in debugging mode
    useEffectAsync(async () => {
        console.log("form", form.values)
        console.log("form", form.errors)
    }, [form])

    return (
        <PublicPage
            title="SIGN_UP"
        >
            <Row className="justify-content-lg-center mt-5">
                <Col lg="8">
                    <form onSubmit={form.handleSubmit}>
                        <Row>
                            <BaseInput
                                className="col-md-6 mt-1"
                                label="name"
                                required
                                name="name"
                                placeholder
                                formik={form}
                            />
                            <BaseInput
                                className="col-md-6 mt-1"
                                label="follow_up_action_url"
                                required
                                name="follow_up_action_url"
                                placeholder
                                formik={form}
                            />
                            <BaseInput
                                className="col-12 mt-1"
                                label="questions"
                                required
                                name="questions"
                                placeholder
                                formik={form}
                            />
                            <BaseInput
                                className="col-12 mt-1"
                                label="legal_content_id"
                                required
                                name="legal_content_id"
                                placeholder
                                formik={form}
                            />
                            {/* <BaseInput
                                className="col-12 mt-1"
                                label="privacy_policy"
                                required
                                name="privacy_policy"
                                placeholder
                                formik={form}
                            /> */}

                        </Row>
                        <div className="d-grid gap-2 my-4 sign_up_btns">
                            <Button disabled={form.isSubmitting} size="lg" type="submit">{t("submit")}</Button>
                        </div>
                    </form>
                </Col>
            </Row>

        </PublicPage>
    )
}

Signup.getLayout = function getLayout(page) {
    return (
        <PublicLayout
            title="SIGN_UP"
        >
            {page}
        </PublicLayout>
    )
}



// import { PublicLayout } from "../components/layouts/public-layout";
// import { useTranslation } from "../hooks/use-translation";
// import FbLeadsApi from "./api/fb-leads";


// export default function FacebookPost() {
//     const FbLeads = new FbLeadsApi()

//     console.log("FbLeadsFbLeadsFbLeadsFbLeads",FbLeads)

//     const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

//     const { t } = useTranslation();
//     function sayHello() {

//         FB.api(
//             '/110807565182912/leadgen_forms',
//             'POST',
//             {"Title":"Testing","follow_up_action_url":"https://driverfly.co/","name":"Site Integration kjkljlkjjlj","user_name":"My User Name","questions":"[{\"type\":\"EMAIL\",\"type\":\"CITY\",\"type\":\"COMPANY_NAME\",\"type\":\"FIRST_NAME\"}]","legal_content_id":"iiiiiiiiiiiiiiiii","privacy_policy":"{\"url\": \"<https://driverfly.co/terms-and-policies>\"}","status":"draft","access_token":"EAAHlZARPsiaEBANlFkGHYKqa0hZAh4bVvv9tbnsPBJUbPRfDokbnroiFVICWqzkXBFQNGBqrCIIToLZBmajOyeQUEx5KnskfERuS3lD5ZBLk1bZBgtZBpZCZAaqo06dr5fieirnh9A9jKMoprkKmscdQnwVxZCZAVLwJ6a8UeGjFBHvlh1ZB3U2g94z1x3Dz2I41HdMHamSWkMRSE474fEPpBez"},
//             function(response) {
//                 // Insert your code here
//             }
//           );
//     }

//     return (
//         <div>
//             <button className="btn btn-primary" type="button" onClick={sayHello}>Submit</button>
//         </div>

//     );
// };



// FacebookPost.getLayout = function getLayout(page) {
//     return (
//         <PublicLayout title="contact">
//             {page}
//         </PublicLayout>
//     )
// }
