import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/use-translation";
import { JobTeamDriver } from "../../enums/jobs/job-team-driver.enum";
import { SearchJobFilterProps } from "../../types/search-filter/job-search-filter.type";


export default function TeamDrivers(props: SearchJobFilterProps) {

    const { t } = useTranslation();
    const { state, method } = props
    const { handleChange } = method

    return (
        <FindJobFilterAccordion {...props} header={t("team_drivers")}>
            <div className="custom-control custom-checkbox p-0">
                <div className="App">
                    <EnumFilterByKeyValue
                        {...props}
                        translate={true}
                        withAll={true}
                        enumArray={JobTeamDriver}
                        labelPrefix="JobTeamDriver"
                        name="team_drivers"
                        handleChange={handleChange}
                    />
                </div>
            </div>
        </FindJobFilterAccordion>
    )
}