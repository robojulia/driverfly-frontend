import { useTranslation } from "../../hooks/useTranslation";

export default function Search(props) {

  const { t } = useTranslation();
  const { state, method } = props
  const { searchQuery } = state
  const { setFiltersByKeyValue, setSearchQuery } = method

  const searchHandler = ({ key, target: { name, value } }) => (key === 'Enter') && setFiltersByKeyValue(name, value)

  return (
    <>
      <label className={props.labelClassName || "heading-label my-4"}>{props.label || t('SEARCH_KEYWORD')} </label>
      <input
        value={searchQuery}
        name="keywords"
        onKeyPress={searchHandler}
        onChange={(e) => { setSearchQuery(e.target.value) }}
        type="text"
        className={props.inputClassName || "form-control shadow-sm p-4"}
        placeholder={t("KEYWORD_PLACEHOLDER")} />
    </>
  )
}