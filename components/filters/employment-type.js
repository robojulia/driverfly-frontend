import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { useTranslation } from "../../hooks/useTranslation";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function EmploymentType(props) {

  const { t } = useTranslation();
  const { state, method } = props
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion {...props} header={t("EMPLOYMENT_TYPE")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="employment_type"
          labelPrefix="JobEmploymentType"
          enums={JobEmploymentType} />
      </FindJobFilterAccordion>
    </>
  )
}