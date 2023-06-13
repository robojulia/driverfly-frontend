import { JobGeography } from "../../enums/jobs/job-geography.enum"
import { useTranslation } from "../../hooks/use-translation";
import { SearchJobFilterProps } from "../../types/search-filter/job-search-filter.type";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function AreasCovered(props: SearchJobFilterProps) {

	const { t } = useTranslation();
	const { state, method } = props
	const { handleChange } = method

	return (
		<FindJobFilterAccordion {...props} header={t("AREAS_COVERED")}>
			<ViewMoreRadioFilter
				{...props}
				handleChange={handleChange}
				name="areas_covered"
				labelPrefix="JobGeography"
				enums={JobGeography} />
		</FindJobFilterAccordion>
	)
}