import { JobSchedule } from "../../enums/jobs/job-schedule.enum"
import { useTranslation } from "../../hooks/use-translation";
import { SearchJobFilterProps } from "../../types/search-filter/job-search-filter.type";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";


export default function Schedule(props: SearchJobFilterProps) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange } = method

    return (
        <FindJobFilterAccordion {...props} header={t("SCHEDULE")}>
            <ViewMoreRadioFilter
                {...props}
                handleChange={handleChange}
                name="schedule"
                labelPrefix="JobSchedule"
                enums={JobSchedule} />
        </FindJobFilterAccordion>
    )
}