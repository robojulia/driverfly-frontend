import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useEffect, useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import FindJobFilterAccordion from '../../find-jobs-accordion/find-job-filter-accordion';
import MapboxApi from "../../../pages/api/mapbox"
import { useTranslation } from '../../../hooks/useTranslation';
import { TypeaheadMenuProps } from 'react-bootstrap-typeahead/types/components/TypeaheadMenu';

export default function Range(props: any) {

    const { t } = useTranslation();
    const { state, method } = props
    const { filters, location, range } = state
    const { setFiltersByKeyValue, setLocation, setRange } = method
    const mapboxApi = new MapboxApi()

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<any>([]);

    const handleSearch = async (query: string): Promise<void> => {
        try {
            if (query) {
                setIsLoading(true);
                const results = await mapboxApi.forwardGeocoding(query)
                setOptions(results?.features || []);
                setIsLoading(false);
            } else {
                setLocation(null)
            }
        } catch (error) {
            console.error("exception.......", error);
        }
    };

    const handleTypeheadChange = (): void => {
        let val = null
        if (location) {
            val = {
                place_name: location.place_name,
                long: location.geometry.coordinates[0],
                lat: location.geometry.coordinates[1],
                range
            }
        }
        setFiltersByKeyValue('location', val)
    }

    useEffect(handleTypeheadChange, [location, range])

    useEffect(() => {
        if (!!!filters) setOptions(null)
    }, [filters])

    return (
        <>
            <FindJobFilterAccordion {...props} header={t("LOCATION")}>
                <AsyncTypeahead
                    defaultInputValue={filters.place_name || filters.location?.place_name || ""}
                    id="async-example"
                    isLoading={isLoading}
                    labelKey="place_name"
                    minLength={1}
                    onChange={value => setLocation(value[0])}
                    onSearch={handleSearch}
                    onInputChange={handleSearch}
                    options={options}
                    placeholder="Location"
                    renderMenuItemChildren={(option: any, menuProps: TypeaheadMenuProps, idx: number) => (
                        <span className='text-dark'>{option.place_name}</span>
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