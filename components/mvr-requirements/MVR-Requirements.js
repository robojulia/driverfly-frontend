import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { MvrType } from "../../enums/users/mvr-type.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function MvrRequirement() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("mvr_requirements")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={MvrType}
          name="mvr_requirements"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
    </>
  )
}