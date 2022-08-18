import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { useTranslation } from "../../hooks/useTranslation"

export default function Sort(props) {

    const { state, method } = useContext(jobContext)
    const { handleChange } = method
    const { t } = useTranslation();

    return (
        <span className={props.labelClassName || "text-secondary w-sm-25"}>
            {t('SORT_BY')}:
            <select
                name="order_by"
                className={props.inputClassName || "custom-select shadow-none mt-2"}
                onChange={handleChange}>
                <option value="">{t('SORT_DEFAULT')}</option>
                <option value="DESC">{t('SORT_NEWEST')}</option>
                <option value="ASC">{t('SORT_OLDEST')}</option>
            </select>
        </span>
    )
}