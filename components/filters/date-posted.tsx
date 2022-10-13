import moment from "moment"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { JobDatePosted } from "../../enums/jobs/job-date-posted.enum"
import { useTranslation } from "../../hooks/useTranslation";
import { ChangeEvent } from "react";


export default function DatePosted(props: any) {

    const { t } = useTranslation();
    const { state, method } = props;
    const { filters } = state;
    const { handleChange, setFiltersByKeyValue } = method;

    function changeHandler(e: ChangeEvent<HTMLInputElement>): void {
        const postedAtLabel = e.target.value;
        let date: string | Date;

        if (postedAtLabel == JobDatePosted.LAST_HOUR) {
            date = moment.utc().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss")
        }
        else if (postedAtLabel == JobDatePosted.LAST_24_HOURS) {
            date = moment.utc().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss")
        }
        else if (postedAtLabel == JobDatePosted.LAST_7_DAYS) {
            date = moment.utc().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss")
        }
        else if (postedAtLabel == JobDatePosted.LAST_14_DAYS) {
            date = moment.utc().subtract(14, "days").format("YYYY-MM-DD HH:mm:ss")
        }
        else if (postedAtLabel == JobDatePosted.LAST_30_DAYS) {
            date = moment.utc().subtract(30, "days").format("YYYY-MM-DD HH:mm:ss")
        }

        handleChange({ target: { name: "date_created", value: { value: date, label: postedAtLabel } } })
    }

    return (
        <FindJobFilterAccordion {...props} header={t("POST_DATE")}>

            <div className="topping ">
                <input
                    checked={(!!!filters.date_created) || (filters.date_created.label == "")}
                    onChange={changeHandler}
                    type="radio"
                    value=""
                /> {t('ALL')}
            </div>
            {Object.values(JobDatePosted).map((value: any) => {
                return (
                    <div key={value} className="topping pt-2">
                        <input
                            checked={(filters.date_created?.label) && (filters.date_created.label == value)}
                            onChange={changeHandler}
                            type="radio"
                            value={value}
                        /> {t("JobDatePosted." + value)}
                    </div>
                )
            })}
        </FindJobFilterAccordion>
    )
}