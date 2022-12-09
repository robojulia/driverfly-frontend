import React, { useState, useEffect } from "react";
import { InputGroup } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion";
import BaseInput from "../forms/base-input";

export type MinimumExperienceType = {
    months: number,
    years: number
}
export default function MinimumYearsExperience(props) {

    const {
        state: { filters: { min_years_experience } },
        method: { setFiltersByKeyValue },
    } = props
    const { t } = useTranslation()

    const [minimumExperience, setMinimumExperience] = useState<MinimumExperienceType>({
        months: min_years_experience ? Math.round((min_years_experience % 1) * 12) : null,
        years: min_years_experience ? Math.floor(min_years_experience) : null
    })

    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>): void =>
        setMinimumExperience({
            ...minimumExperience,
            [name]: value ? parseInt(value) : 0
        })


    useEffect(() => {
        let minExperience: number = 0;
        if (minimumExperience.months) {
            minExperience = minimumExperience.years + (minimumExperience.months / 12);
        }
        else {
            minExperience = minimumExperience.years;
        }

        setFiltersByKeyValue('min_years_experience', minExperience)

    }, [minimumExperience])

    return (
        <FindJobFilterAccordion {...props} header={t("MIN_YEARS_EXPERIENCE")}>
            <div className="custom-control custom-checkbox p-0">
                <div className="App">
                    <InputGroup className="flex-nowrap rounded d-block">
                        <BaseInput
                            className="col-md-6 d-inline-block p-0 mb-2"
                            placeholder="5"
                            value={minimumExperience.years}
                            name="years"
                            required
                            min="0"
                            type="int"
                            onChange={handleChange}
                            append={(<InputGroup.Text>{t('YEARS_SHORT')}</InputGroup.Text>)}
                        />
                        <BaseInput
                            className="col-md-6 d-inline-block p-0"
                            placeholder="5"
                            name="months"
                            required
                            min="0"
                            max="11"
                            type="int"
                            value={minimumExperience.months}
                            append={(<InputGroup.Text>{t('MONTHS_SHORT')}</InputGroup.Text>)}
                            onChange={handleChange}
                        />
                    </InputGroup>
                </div>
            </div>
        </FindJobFilterAccordion>
    )
}