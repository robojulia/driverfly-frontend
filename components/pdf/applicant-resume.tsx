import { useTranslation } from "../../hooks/use-translation";
import React, { useState } from "react";
import { useEffectAsync } from "../../utils/react";
import { CloudArrowDownFill } from "react-bootstrap-icons";
import ReactPDF, {
	PDFDownloadLink,
	Text,
	Font,
	Page,
	View,
	Document,
	StyleSheet,
} from "@react-pdf/renderer";
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { Button } from "react-bootstrap";
import Header from "./header";
import Skills from "./skills";
import BasicDetails from "./basic-details";
import Experience from "./experience";
export interface ApplicantResumeProps extends ViewApplicantDetailProps {
	disabled?: boolean | (() => boolean);
	className?: string;
}

export default function ApplicantResume({
	applicant,
	disabled,
	className,
}: ApplicantResumeProps) {
	const { t } = useTranslation();

	const [resume, setResume] = useState<any>(null);
	const recreateResume = () =>
		setResume(applicant ? generateResume(applicant) : null);

	useEffectAsync(async () => {
		if (!!!applicant) return;
		recreateResume();
	}, [applicant]);

	if (!!!applicant) return <></>;

	const styles = StyleSheet.create({
		page: {
			padding: 30,
		},
		container: {
			flex: 1,
			flexDirection: "row",
			"@media max-width: 400": {
				flexDirection: "column",
			},
		},
		image: {
			marginBottom: 10,
		},
		leftColumn: {
			flexDirection: "column",
			width: "100%",
			paddingTop: 30,
			paddingRight: 15,
			"@media max-width: 400": {
				width: "100%",
				paddingRight: 0,
			},
			"@media orientation: landscape": {
				width: 200,
			},
		},
		rightColumn: {
			flexDirection: "column",
			width: "100%",
			paddingTop: 30,
			paddingRight: 15,
			"@media max-width: 400": {
				width: "100%",
				paddingRight: 0,
			},
			"@media orientation: landscape": {
				width: 200,
			},
		},
		footer: {
			fontSize: 12,
			fontFamily: "Lato Bold",
			textAlign: "center",
			marginTop: 15,
			paddingTop: 5,
			borderWidth: 3,
			borderColor: "#2DA2AF",
			borderStyle: "dashed",
			"@media orientation: landscape": {
				marginTop: 10,
			},
		},
	});

	Font.register({
		family: "Open Sans",
		src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`,
	});

	Font.register({
		family: "Lato",
		src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
	});

	Font.register({
		family: "Lato Italic",
		src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
	});

	Font.register({
		family: "Lato Bold",
		src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
	});

	const generateResume = (applicant: ApplicantEntity) => (
		<Document>
			<Page size="A4" style={styles.page}>
				<Header applicant={applicant} />
				<View style={styles.container}>
					<View style={styles.leftColumn}>
						<BasicDetails t={t} applicant={applicant} />
					</View>
					<View style={styles.rightColumn}>
						<Skills t={t} applicant={applicant} />
					</View>
				</View>
				<View style={styles.container}>
					<Experience t={t} applicant={applicant} />
				</View>
				{/* <Text style={styles.footer}>{t("THIS_IS_THE_CANDIDATE_YOU_ARE_LOOKING_FOR")}</Text> */}
			</Page>
		</Document>
	);

	return (
		<>
			{resume && (
				<PDFDownloadLink
					className={className}
					document={resume}
					fileName="Resume.pdf"
				>
					{({ blob, url, loading, error }) => (
						<Button
							disabled={!!disabled || !!loading}
							className="btn btn-outline-secondary"
						>
							{loading ? (
								<span className="spinner-grow spinner-grow-sm"></span>
							) : (
								<CloudArrowDownFill />
							)}{" "}
							{t("RESUME")}
						</Button>
					)}
				</PDFDownloadLink>
			)}
		</>
	);
}
