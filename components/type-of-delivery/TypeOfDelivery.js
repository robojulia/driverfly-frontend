import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function TypeOfDelivery() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>

      <FindJobFilterAccordion header={t("TYPE_OF_DELIVERY")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={JobDeliveryType}
          name="delivery_type"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
    </>
  )
}