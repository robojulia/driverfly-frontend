import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { useContext } from "react"
import jobContext from "../../context/jobContext"


export default function Range() {

    const [value, setValue] = React.useState(50);
    const { filters, applyFilters } = useContext(jobContext)
    const keyPressHandler = e => {
        console.log('e.target.value', e.target.value)
        filters.location = e.target.value
        applyFilters()
    }

    return (
        <>
            <div className="card">
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
                        <input
                            onKeyUpCapture={e => setTimeout(() => {
                                keyPressHandler(e)
                            }, 500)}
                            type="text"
                            className="form-control p-4"
                            placeholder="All Location" />
                        <div className='mt-3 text-info'>Radius: {value} miles</div>
                        <RangeSlider
                            value={value}
                            onChange={e => setValue(e.target.value)}

                            variant='info'
                        />
                    </div>

                </div>
            </div>


        </>
    )
}