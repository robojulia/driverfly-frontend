import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015


export default function Location() {

    const { state, method } = useContext(jobContext)
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
            console.error(error);
        }
    };


    const searchByLocation = e => {
        e.preventDefault()
        console.log("location", location)
    }

    return (
        <>
            <form onSubmit={searchByLocation}>
                <div className="filter-inner d-flex align-items-baseline pl-lg-3 mt-lg-2 ml-lg-3">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <AsyncTypeahead
                        className='form-control border-0 w-25'
                        id="async-example location"
                        name="location"
                        isLoading={isLoading}
                        labelKey="place_name"
                        minLength={1}
                        onChange={value => setLocation(value)}
                        onSearch={handleSearch}
                        options={options}
                        placeholder="Location"
                        renderMenuItemChildren={(option, props) => (
                            <>
                                <span className='text-dark'>{option.place_name}</span>
                            </>
                        )}
                    />
                    {/* <input name="location" type="text" className="form-control border-0 w-25" placeholder="Location" /> */}
                    {/* <span className="find-me"></span> */}
                    <button type="submit" className="btn btn-danger btn-lg br-0 ">Search</button>
                </div>
            </form>
        </>
    )
}