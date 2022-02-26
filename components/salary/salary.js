import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';

export default function Salary() {

    const [value, setValue] = React.useState(18);


    return (
        <>
            <div className="card">
                <div className="card-header" id="headingFive">
                    <h4 className="clearfix mb-0">
                        <a className="btn-3 btn-link" data-toggle="collapse"
                            data-target="#collapseFive" aria-expanded="true"
                            aria-controls="collapseFive">Salary <i
                                className="fa fa-angle-down"></i></a>
                    </h4>
                </div>
                <div id="collapseFive" className="collapse show"
                    aria-labelledby="headingFive" data-parent="#accordionExample">
                    <div className="card-body">
                        <div className="App">
                            <div className="topping pt-2">
                                <input type="radio" id="monthly" name="salry" value="Paneer" />Monthly
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="weekly" name="salry" value="Paneer" />Weekly
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="daily" name="salry" value="Paneer" />Daily
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="hourly" name="salry" value="Paneer" />Hourly
                            </div>
                            <div className="topping pt-2">
                                <input type="radio" id="yearly" name="salry" value="Paneer" />Yearly
                            </div>
                        </div>
                        <RangeSlider
                            value={value}
                            min={18}
                            max={95000}
                            onChange={e => setValue(e.target.value)}

                            variant='info'
                        />
                        
                         <div className='row'>
                            <div className='col'>
                                ${value}
                            </div>
                            <div className='col text-right'>
                                95000
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}