import { KeyboardEvent, ChangeEvent } from "react";
import { useTranslation } from "../../hooks/useTranslation";

export default function Search(props) {

  const { t } = useTranslation();
  const { state, method } = props
  const { searchQuery } = state
  const { setFiltersByKeyValue, setSearchQuery } = method

  const searchHandler = ({ key }: KeyboardEvent<HTMLInputElement>): void => (key === 'Enter') && setFiltersByKeyValue('keywords', searchQuery)
  const changeHandler = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => setSearchQuery(value)

  return (
    <>
      <label className={props.labelClassName || "heading-label my-4"}>{props.label || t('SEARCH_KEYWORD')} </label>
      <input
        value={searchQuery}
        name="keywords"
        onKeyPress={searchHandler}
        onChange={changeHandler}
        type="text"
        className={props.inputClassName || "form-control shadow-sm p-4"}
        placeholder={t("KEYWORD_PLACEHOLDER")} />
      <small className='ml-1 mt-2 form-text get_result_text'>{t("GET_RESULTS")}</small>

    </>
  )
}