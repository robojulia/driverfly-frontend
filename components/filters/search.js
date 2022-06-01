import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { useTranslation } from "../../hooks/useTranslation"
import { updateQueryStringParameter } from "../../logics/utils"

export default function Search(props) {

  const { t, state, method } = props
  const { filters } = state
  const { setFilters, applyFilters } = method

  const searchHandler = e => {
    if (e.key === 'Enter') {
      setFilters({
        ...filters,
        keywords: e.target.value
      }, applyFilters())
    }
  }

  return (
    <>
      <label className={props.labelClassName || "heading-label my-4"}>{props.label || t('SEARCH_KEYWORD')} </label>
      <input name="keywords" onKeyPress={searchHandler} type="text" className={props.inputClassName || "form-control shadow-sm p-4"} placeholder={t("KEYWORD_PLACEHOLDER")} />
    </>
  )
}