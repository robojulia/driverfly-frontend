import { deleteKey, updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobGeography } from "../../enums/jobs/job-geography.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function AreasCovered() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("areas_covered")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={JobGeography}
          name="areas_covered"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
    </>
  )
}