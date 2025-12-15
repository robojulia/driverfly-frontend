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
import BasicInformation from "./sections/basic-information";
import CDLInformation from "./sections/cdl-information";
import EquipmentExperience from "./sections/equipment-experience";
import EquipmentOwned from "./sections/equipment-owned";
import PreviousEmployment from "./sections/previous-employment";
import SafetyBackground from "./sections/safety-background";
import Preferences from "./sections/preferences";
import ApplicationDetails from "./sections/application-details";
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
			fontFamily: "Poppins",
		},
	});

	Font.register({
		family: "Poppins",
		src: `https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf`,
	});

	Font.register({
		family: "Poppins Bold",
		src: `https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf`,
	});

	Font.register({
		family: "Poppins SemiBold",
		src: `https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6V1s.ttf`,
	});

	Font.register({
		family: "Poppins Medium",
		src: `https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9V1s.ttf`,
	});

	const generateResume = (applicant: ApplicantEntity) => (
		<Document>
			<Page size="A4" style={styles.page}>
				<Header applicant={applicant} />

				{/* Section 1: Basic Information */}
				<BasicInformation t={t} applicant={applicant} />

				{/* Section 2: CDL Information */}
				<CDLInformation t={t} applicant={applicant} />

				{/* Section 3: Equipment Experience */}
				<EquipmentExperience t={t} applicant={applicant} />

				{/* Section 4: Equipment Owned (only for owner-operators) */}
				<EquipmentOwned t={t} applicant={applicant} />

				{/* Section 5: Previous Employment */}
				<PreviousEmployment t={t} applicant={applicant} />

				{/* Section 6: Safety Background */}
				<SafetyBackground t={t} applicant={applicant} />

				{/* Section 7: Preferences */}
				<Preferences t={t} applicant={applicant} />

				{/* Section 8: Application Details (moved after safety) */}
				<ApplicationDetails t={t} applicant={applicant} />
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
