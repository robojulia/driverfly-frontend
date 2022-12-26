import { Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import styles from "../../../../styles/voe.module.css";
import { ApplicantVoeFormEnum } from "../../../../enums/applicants/applicant-voe-form.enum";
import { ApplicantVoeFormEntity } from "../../../../models/applicant/applicant-voe-form.entity";
import {
	ApplicantEmployerEntity,
	ApplicantEntity,
} from "../../../../models/applicant";
import ViewCard from "../../../view-details/view-card";
import ViewDetails from "../../../view-details/view-details";

export interface ViewVoeDetailsProps {
	applicant: ApplicantEntity;
	employer: ApplicantEmployerEntity;
	applicantVoe: ApplicantVoeFormEntity[];
}

export function ViewVoeDetails({
	applicant,
	employer,
	applicantVoe,
}: ViewVoeDetailsProps) {
	const { t } = useTranslation();

	const signature = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.SIGNATURE_VOE
	);
	const employed_by_us = applicant?.voeData?.find(
		(v) => v.type === ApplicantVoeFormEnum.EMPLOYED_BY_US
	);
	const did_drive = applicant?.voeData?.find(
		(v) => v.type === ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU
	);
	const safety_performance = applicant?.voeData?.find(
		(v) => v.type === ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT
	);
	const accident_register = applicant?.voeData?.find(
		(v) => v.type === ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS
	);
	const sender_info = applicant?.voeData?.find(
		(v) => v.type === ApplicantVoeFormEnum.SENDER_INFO
	);
	const apx = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.WAS_EMPLOYED_AS
	);
	const apx_did_drive = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU
	);
	const apx_safety_performance = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT
	);
	const apx_accident_details = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS
	);
	const apx_report_to_govt = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.ACCIDENT_REPORTED_TO_GOVERNMENT
	);
	const apx_reason_to_leave = applicantVoe?.find(
		(v) => v.type === ApplicantVoeFormEnum.REASON_TO_LEAVE_EMPLOYMENT
	);

	return (
		<>
			<Row>
				<h4 className={styles.carrierName}>{t("VOE_SUBMIT_DETAILS")}</h4>
			</Row>
			<Row>
				<span className="text-black my-3 text-center">
					{t("VERIFICATION_OF_{APPLICANT_NAME}_BY_{EMPLOYER_NAME}", {
						APPLICANT_NAME: `${applicant?.first_name} ${applicant?.last_name}`,
						EMPLOYER_NAME: `${employer?.name}`,
					})}
				</span>
			</Row>
			<ViewCard title="BASIC_QUESTIONAIRE">
				<ViewDetails
					default={t("NOT_ANSWERED")}
					obj={{
						EMPLOYED_BY_US: employed_by_us?.value ? t("YES") : t("NO"),
						VOE_DRIVER_QUES: did_drive?.value ? t("YES") : t("NO"),
						SAFETY_PERFORMANCE_REPORT: safety_performance?.value
							? t("YES")
							: t("NO"),
						ACCIDENT_REGISTER: accident_register?.value ? t("YES") : t("NO"),
					}}
				/>
			</ViewCard>
			<ViewCard title="WAS_EMPLOYED_AS">
				<ViewDetails
					obj={{
						POSITION: apx?.value.position,
						START_DATE: apx?.value.start_date,
						END_DATE: apx?.value.end_date,
					}}
				/>
			</ViewCard>

			<Row className={`${styles.align__text_left} ${styles.paragraph}`}>
				<label className={`${styles.bold}`}>{t("TYPE_OF_VEHICLE")}</label>
				<Col className={`${styles.align__text_left} ${styles.paragraph}`}>
					{!!apx_did_drive?.value ? <p>{apx_did_drive?.value}</p> : ""}
				</Col>
			</Row>

			<Row className={`${styles.align__text_left}${styles.paragraph}`}>
				<label className={`${styles.bold}`}>
					{t("OTHER_GOV_REPORTED_ACCIDENTS")}
				</label>
				<Col className={`${styles.align__text_left}  ${styles.paragraph}`}>
					{!!apx_report_to_govt?.value ? (
						<p>{apx_report_to_govt?.value}</p>
					) : (
						""
					)}
				</Col>
			</Row>

			<ViewCard title="REASON_TO_LEAVE">
				<ViewDetails
					obj={{
						REASON_TO_LEAVE_EMPLOYMENT: apx_reason_to_leave?.value,
						FULL_NAME: sender_info?.value?.name,
						title: sender_info?.value?.title,
						phone: sender_info?.value?.phone,
						email: sender_info?.value?.email,
						DATE: sender_info?.value?.date,
					}}
				/>
			</ViewCard>

			<Row className={`${styles.align__text_left}`}>
				<label className={`${styles.bold}`}>{t("SIGNATURE")}</label>
				<Col className="">
					{!!signature?.value ? (
						<img
							src={signature?.value}
							style={{
								width: "100%",
								height: "200px",
								border: "1px solid black",
							}}
							alt="image"
						/>
					) : (
						""
					)}
				</Col>
			</Row>
		</>
	);
}
