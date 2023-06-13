import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import { useTranslation } from "../../hooks/use-translation";
import { SearchJobFilterProps } from "../../types/search-filter/job-search-filter.type";

export default function Equipment(props: SearchJobFilterProps) {

	const { t } = useTranslation();
	const { state, method } = props
	const { handleChange } = method

	return (
		<FindJobFilterAccordion {...props} header={t("EQUIPMENT_TYPE")}>
			<ViewMoreRadioFilter
				{...props}
				handleChange={handleChange}
				name="equipment_type"
				labelPrefix="JobEquipmentType"
				enums={JobEquipmentType} />
		</FindJobFilterAccordion>
	)
}