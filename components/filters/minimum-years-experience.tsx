import { useState, useEffect, useRef } from "react";
import { InputGroup } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import JobApi from "../../pages/api/job";
import BaseInput from "../forms/base-input";

export default function MinimumYearsExperience(props) {

    const {
        state: { filters, searchQuery },
        method: { setFiltersByKeyValue, setSearchQuery },
        labelClassName,
        label,
    } = props
    const { t } = useTranslation()


    const [minimumYearsExperience, setMinimumYearsExperience] = useState('');
    // const [firstName, setFirstName] = useState('');

    // const setOpen = () => setIsOpen(true)
    // const setClose = () => setIsOpen(false)

    function handleChange(e) {
        console.log(e.target.value);
    }

    useEffect(() => {

        setFiltersByKeyValue('keywords', searchQuery)

        // setClose()
    }, [searchQuery])

    return (
        <>
            <label className={labelClassName || "heading-label my-4"}>{label || t('MIN_YEARS_EXPERIENCE')} </label>
            <InputGroup className="flex-nowrap rounded d-block">
                <BaseInput
                    className="col-md-6 d-inline-block p-0 mb-2"
                    placeholder="5"
                    value={minimumYearsExperience}
                    name="min_experience_in_years"
                    required
                    min="0"
                    type="int"
                    onChange={e => setMinimumYearsExperience(e.target.value)}
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
                    append={(<InputGroup.Text>{t('MONTHS_SHORT')}</InputGroup.Text>)}
                />


            </InputGroup>
        </>
    )
}