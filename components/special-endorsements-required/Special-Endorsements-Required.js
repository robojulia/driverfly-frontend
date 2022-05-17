import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function SpecialEndorsementsRequired() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("special_endorsements_required")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={DriverEndorsement}
          name="endoresements_type"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
    </>
  )
}