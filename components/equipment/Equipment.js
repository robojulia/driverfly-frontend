import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from '../find-jobs/filters/view-more-radio-filter';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import { useContext } from 'react';
import jobContext from '../../context/jobContext';

export default function Equipment() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { filters } = state
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("equipment_type")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="equipment_type"
          labelPrefix="JobEquipmentType"
          enums={JobEquipmentType} />

      </FindJobFilterAccordion>
    </>
  )
}