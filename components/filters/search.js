import { useTranslation } from "../../hooks/useTranslation";

export default function Search(props) {

  const { t } = useTranslation();
  const { state, method } = props
  const { filters } = state
  const { setFiltersByKeyValue } = method

  const searchHandler = e => {
    if (e.key === 'Enter') {
      setFiltersByKeyValue(e.target.name, e.target.value)
    }
  }

  return (
    <>
      <label className={props.labelClassName || "heading-label my-4"}>{props.label || t('SEARCH_KEYWORD')} </label>
      <input name="keywords" onKeyPress={searchHandler} type="text" className={props.inputClassName || "form-control shadow-sm p-4"} placeholder={t("KEYWORD_PLACEHOLDER")} />
    </>
  )
}