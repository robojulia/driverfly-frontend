import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum"
import { useTranslation } from "../../hooks/use-translation";


export default function TransmissionType(props: any) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange } = method

    return (
        <FindJobFilterAccordion {...props} header={t("TRANSMISSION_TYPE")}>
            <div className="custom-control custom-checkbox p-0">
                <div className="App">
                    <EnumFilterByKeyValue
                        {...props}
                        translate={true}
                        withAll={true}
                        enumArray={VehicleTransmissionType}
                        labelPrefix="VehicleTransmissionType"
                        name="transmission_type_experience"
                        handleChange={handleChange}
                    />
                </div>
            </div>
        </FindJobFilterAccordion>
    )
}