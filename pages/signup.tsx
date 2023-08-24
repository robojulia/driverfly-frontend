import Link from "next/link"
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useEffect } from "react";
import { useFormik } from "formik";
import { Row, Col, Button } from "react-bootstrap"

import 'react-toastify/dist/ReactToastify.css'

import { PublicLayout } from "../components/layouts/public-layout";
import SignupStyle from "../public/css/signup.module.css"
import BaseInput from "../components/forms/base-input";
import BaseSelect from "../components/forms/base-select";
import BaseCheck from "../components/forms/base-check";
import BaseInputPhone from "../components/forms/base-input-phone";

import AuthApi from "./api/auth";

import { useTranslation } from "../hooks/use-translation";
import { SignUpRole } from "../enums/auth/sign-up-role.enum"

import { globalAjaxExceptionHandler } from "../utils/ajax";
import { SignUpDto } from "../models/auth/sign-up.dto";
import { PublicPage } from "../components/layouts/public/public-page";
import BaseTextArea from "../components/forms/base-text-area";
import { useEffectAsync } from "../utils/react";
import Head from "next/head";

export default function Signup() {

	const router = useRouter();

	const { utm_source, utm_medium, utm_campaign, utm_content } = router.query;

	const isReferred = Boolean(utm_source) || Boolean(utm_medium) || Boolean(utm_campaign);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new SignUpDto(),
		validationSchema: SignUpDto.yupSchema(),
		onSubmit: async (dto) => {
			const authApi = new AuthApi();
			try {
				await authApi.signUp(dto);
				toast.success(t("SUCCESSFULLY_REGISTERED"));
				setTimeout(() => router.push('/login'), 3000);
			}
			catch (e) {
				globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SIGNUP" });

				if (e?.response?.data?.email == "ALREADY_EXISTS") form.setFieldError('email', "ACCOUNT_ALREADY_EXISTS_WITH_EMAIL")
				if (e?.response?.data?.contact_number == "ALREADY_EXISTS") {
					form.setFieldError('contact_number', "ALREADY_EXISTS")
					form.setFieldError('phone', t("ACCOUNT_ALREADY_EXISTS_WITH_PHONE_{censor_email}", { censor_email: e.response?.data?.user?.email }, { translateProps: false }))
				}
			}
		}
	});

	useEffect(() => {
		form.setValues({
			...form.values,
			utm_medium: `${utm_medium || ""}`,
			utm_source: `${utm_source || ""}`,
			utm_campaign: `${utm_campaign || ""}`,
			utm_content: `${utm_content || ""}`
		})
	}, []);

	//  Uncomment this in debugging mode
	useEffectAsync(async () => {
		console.log("form values", form.values)
		console.log("form errors", form.errors)
	}, [form])

	return (
		<PublicPage
			title="SIGN_UP"
		>
		<Head>
        <title>{t("SIGNUP_META_TITLE")} </title>
        <meta
          name="description"
          content={t("SIGNUP_META_DESC")} 		  key="desc"
        />
        </Head>
			<Row className={`${SignupStyle.banner}`}>
				<Col>
					<h1>{t("SignUp.DRIVERS_HAVE_ACCESS")}<br />{t("SignUp.TO_OVER_1000_JOBS")}</h1>
					<p>{t("SignUp.ARE_YOU_A_MOTOR_CARRIER")} {t("SignUp.VIEW_OUR_PACKAGES")}
						<Link href="http://go.driverfly.co/motor-carriers">
							<a className="mx-1" target="__blank">{t("HERE")}</a>
						</Link>
						{t("OR")}
						<Link href="/contact">
							<a className="mx-1">{t("SignUp.CONTACT_US")}</a>
						</Link>
						{t("SignUp.FOR_AN_ACCOUNT")}</p>
					<p>{t("SignUp.IF_YOU_ARE_ALREADY_A_USER_LOGIN")}
						<Link href="/login">
							<a className="ml-1">{t("HERE")}</a>
						</Link>.
					</p>
				</Col>
			</Row>
			<Row>
				<Col>
					<h2 className="text-center">{t("CREATE_NEW_ACCOUNT")}</h2>
				</Col>
			</Row>
			<Row className="justify-content-lg-center">
				<Col lg="8">
					<form onSubmit={form.handleSubmit}>
						<Row>
							<BaseSelect
								className="col-12 mt-1"
								label="ROLE"
								name="role"
								required
								placeholder
								formik={form}
								labelPrefix="SignUpRole"
								enumType={SignUpRole}
							/>
							{
								form.values.role === SignUpRole.COMPANY &&
								<BaseInput
									className="col-12 mt-1"
									label="COMPANY_NAME"
									required
									name="name"
									placeholder
									formik={form}
								/>
							}
							<BaseInput
								className="col-md-6 mt-1"
								label="FIRST_NAME"
								required
								name="first_name"
								placeholder
								formik={form}
							/>
							<BaseInput
								className="col-md-6 mt-1"
								label="LAST_NAME"
								required
								name="last_name"
								placeholder
								formik={form}
							/>
							<BaseInput
								className="col-12 mt-1"
								label="EMAIL"
								required
								name="email"
								placeholder
								formik={form}
							/>

							{form.errors.email == "ACCOUNT_ALREADY_EXISTS_WITH_EMAIL" &&
								<>
									<Link href="/login">
										<a className="mx-1">{t("LOGIN")}</a>
									</Link>
									<Link href="/forgot-password">
										<a className="mx-1">{t("RESET_PASSWORD")}</a>
									</Link>
								</>
							}

							<BaseInputPhone
								className="col-12 mt-1"
								label="PHONE"
								name="phone"
								placeholder
								formik={form}
							/>

							{form.errors.contact_number == "ALREADY_EXISTS" &&
								<>
									<Link href="/forgot-password">
										<a className="mx-1">{t("RESET_PASSWORD")}</a>
									</Link>
								</>
							}

							<BaseInput
								className="col-md-6 mt-1"
								label="PASSWORD"
								required
								type="password"
								name="password"
								placeholder
								formik={form}
							/>
							<BaseInput
								className="col-md-6 mt-1"
								label="CONFIRM_PASSWORD"
								required
								type="password"
								name="confirmPassword"
								placeholder
								formik={form}
							/>
							{
								form.values.role === SignUpRole.COMPANY &&
								<BaseCheck
									className="col-12 mt-1 py-2"
									label="PERSONAL_RECRUITER"
									name="personal_recruiter"
									formik={form}
								/>
							}
							{
								form.values.role === SignUpRole.COMPANY &&
								<BaseInput
									className="col-12 mt-1"
									label="INVITE_CODE"
									required
									name="invite_code"
									placeholder
									formik={form}
								/>
							}
							{
								(!isReferred && form.values.role === SignUpRole.COMPANY) &&
								<>
									<BaseSelect
										className="col-12 mt-1"
										label="HOW_DID_YOU_HEAR_ABOUT_US"
										name="utm_source"
										formik={form}
										options={[
											{
												label: t("utm_source.ON_MY_OWN"),
												value: ""
											},
											{
												label: t("utm_source.DRIVERFLY_REPRESENTATIVE"),
												value: "rep",
											},
											{
												label: t("utm_source.FRIEND"),
												value: "friend",
											},
											{
												label: t("utm_source.GOOGLE"),
												value: "google",
											},
											{
												label: t("utm_source.FACEBOOK"),
												value: "facebook",
											},
											{
												label: t("utm_source.OTHER"),
												value: "other",
											}
										]}
									/>
									{
										form.values.utm_source === "rep" &&
										<BaseInput
											className="col-12 mt-1"
											label="utm_campaign.REFERRAL_CODE"
											name="utm_campaign"
											placeholder
											formik={form}
										/>
									}
									{
										form.values.utm_source === "other" &&
										<BaseTextArea
											className="col-12 mt-1"
											label="utm_content.DETAILS_OPTIONAL"
											name="utm_content"
											placeholder
											formik={form}
										/>
									}
								</>
							}
						</Row>
						<Row className="mt-2">
							<Col className="signup_toggle_btn">
								<BaseCheck
									className="checklist_toggle"
									label="YOU_ACCEPT_OUR_TOS"
									name="accept_tos"
									formik={form}
								/>
								<span>
									<Link href="/terms-and-policies">
										<a className="mx-1 primary" >{t("terms_and_condition")}</a>
									</Link>
								</span>
								<span>{t("AND")}</span>
								<Link href="/privacy-policy">
									<a className="mx-1 primary">{t("privacy_policy")}</a>
								</Link>
							</Col>

						</Row>
						<div className="d-grid gap-2 my-4 sign_up_btns">
							<Button disabled={form.isSubmitting} size="lg" className="w-100" type="submit">{t("REGISTER_NOW")}</Button>
							<div className="my-1 w-100 text-center">
								<span>{t("OR")}</span>
							</div>
							<Link href="/login">
								<Button size="lg" className="w-100">{t("IF_YOURE_ALREADY_A_USER_LOGIN_HERE")}</Button>
							</Link>
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