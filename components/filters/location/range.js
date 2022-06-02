import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useEffect, useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import FindJobFilterAccordion from '../../find-jobs-accordion/find-job-filter-accordion';


export default function Range(props) {

    const { t, state, method } = props
    const { filters } = state
    const { setFilters } = method

    const [range, setRange] = useState(50);
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = async (query) => {
        setIsLoading(true);
        try {
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.MAPBOX_API_KEY}&autocomplete=true`;
            const results = await fetch(endpoint).then(response => response.json());
            setOptions(results?.features);
            setIsLoading(false);

        } catch (error) {
            console.error("exception.......", error);
        }
    };

    const handleTypeheadChange = () => {
        if (location) {
            setFilters({
                ...filters,
                location: {
                    long: location.geometry.coordinates[0],
                    lat: location.geometry.coordinates[1],
                    range
                }
            })
        }
    }

    useEffect(handleTypeheadChange, [location, range])

    return (
        <>
            <FindJobFilterAccordion {...props} header={t("LOCATION")}>
                <AsyncTypeahead
                    id="async-example"
                    name="location"
                    isLoading={isLoading}
                    labelKey="place_name"
                    minLength={1}
                    onChange={value => setLocation(value[0])}
                    onSearch={handleSearch}
                    options={options}
                    placeholder="Location"
                    renderMenuItemChildren={(option, props) => (
                        <>
                            <span className='text-dark'>{option.place_name}</span>
                        </>
                    )}
                />
                {
                    location &&
                    <>
                        <div className='mt-3 text-info'>{t('RADIUS')}: {range} {t('MILES')}</div>
                        <RangeSlider
                            max={500}
                            value={range}
                            onChange={e => setRange(e.target.value)}
                            variant='info'
                        />
                    </>
                }
            </FindJobFilterAccordion>
        </>
    )
}