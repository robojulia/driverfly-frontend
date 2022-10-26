import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useEffect, useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { useContext } from "react"
import schoolContext from "../../context/school-context"
import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015


export default function Range() {

    const { state, method } = useContext(schoolContext)
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
            <div className="p-2">
                <div className="card-header" id="headingTwo">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseTwo" aria-expanded="true"
                            aria-controls="collapseTwo">
                            Location
                            <i className="fa fa-angle-down"></i>
                        </a>
                    </h4>
                </div>
                <div id="collapseTwo" className="collapse show "
                    aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div className="card-body">
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
                                <div className='mt-3 text-info'>Radius: {range} miles</div>
                                <RangeSlider
                                    max={500}
                                    value={range}
                                    onChange={e => setRange(e.target.value)}
                                    variant='info'
                                />
                            </>
                        }
                    </div>

                </div>
            </div>


        </>
    )
}
