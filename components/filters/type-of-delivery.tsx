import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum"
import { useTranslation } from "../../hooks/use-translation";
import { SearchJobFilterProps } from "../../types/search-filter/job-search-filter.type";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function TypeOfDelivery(props: SearchJobFilterProps) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange } = method

    return (
        <FindJobFilterAccordion {...props} header={t("TYPE_OF_DELIVERY")}>
            <ViewMoreRadioFilter
                {...props}
                handleChange={handleChange}
                name="delivery_type"
                labelPrefix="JobDeliveryType"
                enums={JobDeliveryType} />
        </FindJobFilterAccordion>
    )
}