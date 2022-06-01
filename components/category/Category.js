import { useContext } from "react"
import jobContext from "../../context/jobContext"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum"
import { ChevronDown } from 'react-bootstrap-icons'
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";


export default function Category() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header= {t("CATEGORY")}>
        <div className="custom-control custom-checkbox p-0">
          <div className="App">
            <EnumFilterByKeyValue
              translate={true}
              withAll={true}
              enumArray={DriverLicenseType}
              labelPrefix="DriverLicenseType"
              name="cdl_class"
              handleChange={handleChange}
            />
          </div>
        </div>
      </FindJobFilterAccordion>

    </>
  )
}