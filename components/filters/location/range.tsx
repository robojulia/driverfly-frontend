import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useEffect, useRef, useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import FindJobFilterAccordion from '../../find-jobs-accordion/find-job-filter-accordion';
import MapboxApi from "../../../pages/api/mapbox"
import { useTranslation } from '../../../hooks/use-translation';
import { TypeaheadMenuProps } from 'react-bootstrap-typeahead/types/components/TypeaheadMenu';
import { SearchJobFilterProps } from '../../../types/search-filter/job-search-filter.type';
import Typeahead from 'react-bootstrap-typeahead/types/core/Typeahead';

export default function Range(props: SearchJobFilterProps) {

    const {
        state: { filters, location, range },
        method: { setFiltersByKeyValue, setLocation, setRange },
    } = props
    const { t } = useTranslation();
    const mapboxApi = new MapboxApi()
    const typeaheadRef = useRef<Typeahead>(null)

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
        else {
            typeaheadRef.current.clear()
        }
        setFiltersByKeyValue('location', val)
    }

    useEffect(handleTypeheadChange, [location, range])

    useEffect(() => {
        if (!!!filters) setOptions(null)
        // console.log("filters.place_name", typeaheadRef.current?.props.defaultInputValue);
        // if (!typeaheadRef.current?.props?.defaultInputValue && filters?.location?.place_name || location?.place_name) typeaheadRef.current?.setItem("defaultInputValue", filters.location.place_name || location.place_name)
        // typeaheadRef.current.props.defaultInputValue = typeaheadRef.current, filters.place_name, filters.location?.place_name
    }, [filters])

    return (
        <FindJobFilterAccordion {...props} header={t("LOCATION")}>
            <AsyncTypeahead
                defaultInputValue={filters.place_name || filters.location?.place_name}
                ref={typeaheadRef}
                id="location-typeahead"
                isLoading={isLoading}
                labelKey="place_name"
                minLength={1}
                onChange={value => {
                    setLocation(value[0])
                    if (range == null) setRange(50)
                }}
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
    )
}