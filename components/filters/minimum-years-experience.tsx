import { useState, useEffect, useRef } from "react";
import { InputGroup } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion";
import BaseInput from "../forms/base-input";

export default function MinimumYearsExperience(props) {

    const {
        state: { filters, searchQuery },
        method: { setFiltersByKeyValue, setSearchQuery },
        labelClassName,
        label,
    } = props
    const { t } = useTranslation()


    const [minimumExperience, setMinimumExperience] = useState({
        minimumMonthExperience: null,
        minimumYearsExperience: null
    })


    useEffect(() => {
        let minExperience: number = 0;
        if (minimumExperience.minimumMonthExperience) {
            minExperience = minimumExperience.minimumYearsExperience + minimumExperience.minimumMonthExperience / 12;
        }
        else {
            minExperience = minimumExperience.minimumMonthExperience;
        }

        setFiltersByKeyValue('min_years_experience', minExperience)

    }, [minimumExperience])



    return (
        <>
            <FindJobFilterAccordion {...props} header={t("MIN_YEARS_EXPERIENCE")}>
                <div className="custom-control custom-checkbox p-0">
                    <div className="App">
                        <InputGroup className="flex-nowrap rounded d-block">
                            <BaseInput
                                className="col-md-6 d-inline-block p-0 mb-2"
                                placeholder="5"
                                value={minimumExperience.minimumYearsExperience}
                                name="min_experience_in_years"
                                required
                                min="0"
                                type="int"
                                onChange={e => setMinimumExperience({ ...minimumExperience, minimumYearsExperience: e.target.value })}
                                append={(<InputGroup.Text>{t('YEARS_SHORT')}</InputGroup.Text>)}

                            />
                            <BaseInput
                                className="col-md-6 d-inline-block p-0"
                                placeholder="5"
                                name="min_experience_in_months"
                                required
                                min="0"
                                max="11"
                                type="int"
                                value={minimumExperience.minimumMonthExperience}
                                append={(<InputGroup.Text>{t('MONTHS_SHORT')}</InputGroup.Text>)}
                                onChange={(e) => setMinimumExperience({ ...minimumExperience, minimumMonthExperience: e.target.value })}
                            />
                        </InputGroup>
                    </div>
                </div>
            </FindJobFilterAccordion>

        </>
    )
}