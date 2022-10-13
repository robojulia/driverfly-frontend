import { MvrType } from "../../enums/users/mvr-type.enum"
import { useTranslation } from "../../hooks/useTranslation";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function MvrRequirement(props: any) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange } = method

    return (
        <FindJobFilterAccordion {...props} header={t("MVR_REQUIREMENTS")}>
            <ViewMoreRadioFilter
                {...props}
                handleChange={handleChange}
                name="mvr_requirements"
                labelPrefix="MvrType"
                enums={MvrType} />
        </FindJobFilterAccordion>
    )
}