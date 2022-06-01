import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';

export default function Equipment(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("equipment_type")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="equipment_type"
          labelPrefix="JobEquipmentType"
          enums={JobEquipmentType} />

      </FindJobFilterAccordion>
    </>
  )
}