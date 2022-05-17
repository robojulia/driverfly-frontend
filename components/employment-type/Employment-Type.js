import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { employment_type } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function EmploymentType() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("employment_type")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={JobEmploymentType}
          name="employment_type"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
    </>
  )
}