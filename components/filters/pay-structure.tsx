import { useEffect } from "react";
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum";
import { useTranslation } from "../../hooks/use-translation";
import { SearchJobFilterProps } from "../../types/search-filter/job-search-filter.type";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion";
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function PayStructure(props: SearchJobFilterProps) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange, setFilters } = method
    useEffect(() => {
        if (!state.filters.pay_structure || state.filters.pay_structure == JobPayMethod.OPEN_TO_NEGOTIATE) {
            setFilters({ ...state.filters, min_weekly_pay: null, max_weekly_pay: null })
        }
    }, [state.filters.pay_structure])
    return (
        <FindJobFilterAccordion {...props} header={t("pay_structure")}>
            <ViewMoreRadioFilter
                {...props}
                handleChange={handleChange}
                name="pay_structure"
                labelPrefix="JobPayMethod"
                enums={JobPayMethod} />
            {state.filters.pay_structure && state.filters.pay_structure !== JobPayMethod.OPEN_TO_NEGOTIATE && <div className="d-flex justify-content-space-between mt-3">
                <input
                    step={0.01}
                    min={0}
                    className="col-6 text-secondary pt-2 pb-2 border rounded mr-1"
                    required
                    name="min_weekly_pay"
                    placeholder={t("min_weekly")}
                    type="number"
                    onChange={handleChange}
                />
                <input
                    step={0.01}
                    min={0}
                    className="col-6 text-secondary pt-2 pb-2 border rounded"
                    required
                    name="max_weekly_pay"
                    placeholder={t("max_weekly")}
                    type="number"
                    onChange={handleChange}
                />
            </div>}
        </FindJobFilterAccordion>
    )
}