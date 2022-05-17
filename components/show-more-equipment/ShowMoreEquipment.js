import { ChevronDown } from 'react-bootstrap-icons'
import Read from '../equipment-show-more/readmore'
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";

export default function ShowMoreEquipment() {
  const { t } = useTranslation();

  return (
    <>
      <FindJobFilterAccordion header={t("equipment_type")}>
      < Read />
      </FindJobFilterAccordion>
    </>
  )
}