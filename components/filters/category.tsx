import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";


export default function Category(props: any) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange } = method

    return (
        <FindJobFilterAccordion {...props} header={t("cdl_type")}>
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
    )
}