import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"


export default function Category(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("CATEGORY")}>
        <div className="custom-control custom-checkbox p-0">
          <div className="App">
            <EnumFilterByKeyValue
              {...props}
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