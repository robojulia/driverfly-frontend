import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function PayStructure() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (

    <>

      <FindJobFilterAccordion header={t("pay_structure")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={JobPayMethod}
          name="pay_structure"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
    </>
  )
}