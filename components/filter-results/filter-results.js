import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import React, { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Default from '../type-of-equipment/default'
import ShowMore from '../type-of-equipment/show-more'
import Read from '../readmore'
// import RangeFilter from './range-slider'


export default function FilterResults() {


    const [showDef, setShowDef] = useState(true);
    function updateState() {
        setShowDef(!showDef);
    }



    const [value, setValue] = React.useState(50);
    const [finalValue, setFinalValue] = React.useState(null);

    return (
        <>
            <div className="col-md-3">
                <h3>Filter Results</h3>
                {/* < RangeFilter /> */}
                <form action="">
                    <label className="heading-label my-4">Search Keywords </label>
                    <input type="text" className="form-control shadow-sm" placeholder="e.g. web design" />
                    <div className="bs-example">
                        <div className="tab-content">
                            <div className="accordion bg-transparent" id="accordionExample">

                                <div className="card mt-3">
                                    <div className="card-header" id="headingOne">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseOne" aria-expanded="true"
                                                aria-controls="collapseOne">Category <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="custom-control custom-checkbox p-0">
                                                <div className="App">
                                                    <div className="topping">
                                                        <input type="checkbox" id="classcdl" name="classcdl" value="Paneer" />Class A CDL(30)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingTwo">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseTwo" aria-expanded="true"
                                                aria-controls="collapseTwo">Location <i
                                                    className="fa fa-angle-down"></i></a>


                                        </h4>
                                    </div>
                                    <div id="collapseTwo" className="collapse show "
                                        aria-labelledby="headingTwo" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <input type="text" className="form-control"
                                                placeholder="All Location" />
                                            <div className='mt-3 text-info'>Radius: {finalValue} miles</div>

                                            <RangeSlider
                                                value={value}
                                                onChange={e => setValue(e.target.value)}
                                                onAfterChange={e => setFinalValue(e.target.value)}
                                                variant='info'
                                            />

                                        </div>

                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingThree">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseThree" aria-expanded="true"
                                                aria-controls="collapseThree">Job Type <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseThree" className="collapse show "
                                        aria-labelledby="headingThree" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="custom-control custom-checkbox p-0">
                                                <div className="App">
                                                    <div className="topping">
                                                        <input type="radio" id="solo" name="jobtype" value="Paneer" />Solo(27)
                                                    </div>
                                                    <div className="topping pt-2">
                                                        <input type="radio" id="teamdrivers" name="jobtype" value="Paneer" />Team Drivers(2)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                                            <div className="rangeslider mt-3 p-0">
                                                <input className="min" name="range_1" type="range" min="1"
                                                    max="95000" value="18" />
                                                <input className="max" name="range_1" type="range" min="1"
                                                    max="95000" value="95000" />
                                                <span className="range_min light left">$18 </span>
                                                <span className="range_max light right">95000 </span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingSix">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseSix" aria-expanded="true"
                                                aria-controls="collapseSix">Date Posted <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseSix" className="collapse show" aria-labelledby="headingSix"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="radio" id="lasthour" name="topping" value="Paneer" />Last Hour
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="hour" name="topping" value="Paneer" />Last 24 Hour
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="topping" name="topping" value="Paneer" />Last 7 days
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="topping" name="topping" value="Paneer" /> Last 14 days
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="topping" name="topping" value="Paneer" />Last 30 days
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="topping" name="topping" value="Paneer" />All
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingNine">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseNine" aria-expanded="true"
                                                aria-controls="collapseNine">Areas Covered<i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseNine" className="collapse show"
                                        aria-labelledby="headingNine" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="lasthour" name="areas" value="Paneer" /> Local(5)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="hour" name="areas" value="Paneer" /> Regional(7)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="areas" value="Paneer" /> OTR (12)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="areas" value="Paneer" />  CrossBorder (1)
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingSix">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseFullPart" aria-expanded="true"
                                                aria-controls="collapseFullPart">Full-time/Part-time <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseFullPart" className="collapse show" aria-labelledby="headingSix"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="radio" id="lasthour" name="areas" value="Paneer" />Part-time (1)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="hour" name="areas" value="Paneer" />Full-time (29)
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingSix">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseEmployment" aria-expanded="true"
                                                aria-controls="collapseEmployment">Employment Type <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseEmployment" className="collapse show" aria-labelledby="headingSix"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="radio" id="lasthour" name="areas" value="Paneer" />W-2 (18)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="hour" name="areas" value="Paneer" />1099 (12)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingSix">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseTypeofDelivery" aria-expanded="true"
                                                aria-controls="collapseTypeofDelivery">Type of Delivery <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseTypeofDelivery" className="collapse show" aria-labelledby="headingSix"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Touch (1)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="hour" name="areas" value="Paneer" />No Touch (1)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Drop-and-hook (6)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="hour" name="areas" value="Paneer" />Dedicated Lanes (1)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingSix">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseacceptdirver" aria-expanded="true"
                                                aria-controls="collapseacceptdirver">Accepting Drivers From... <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseacceptdirver" className="collapse show" aria-labelledby="headingSix"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Anywhere in the US (5)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="hour" name="areas" value="Paneer" />Alabama (2)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Arizona (2)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="hour" name="areas" value="Paneer" />California (8)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="lasthour" name="areas" value="Paneer" />Colorado (1)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="hour" name="areas" value="Paneer" />Connecticut (1)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingsee">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseseemore" aria-expanded="true"
                                                aria-controls="collapseseemore">Equipment Type<i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseseemore" className="collapse show"
                                        aria-labelledby="headingsee" data-parent="#accordionExample">
                                        <div className="card-body">
                                            {
                                                showDef ? <Default />
                                                    :
                                                    <ShowMore />

                                            }
                                            <label onClick={updateState}>See More +
                                           
                                            </label>
                                            < Read />
                                             
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingSix">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseSchedule" aria-expanded="true"
                                                aria-controls="collapseSchedule">Schedule <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseSchedule" className="collapse show" aria-labelledby="headingSix"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="radio" id="lasthour" name="areas" value="Paneer" />Multiple weeks on the road (6)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="hour" name="areas" value="Paneer" />Most weekends off (2)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="lasthour" name="areas" value="Paneer" />Weekends off (7)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="radio" id="hour" name="areas" value="Paneer" />Other (12)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingFour">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapseFour" aria-expanded="true"
                                                aria-controls="collapseFour">Pay Structure <i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapseFour" className="collapse show"
                                        aria-labelledby="headingFour" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="App">
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="topping" value="Paneer" />Rate per mile (8)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="topping" value="Paneer" />Percent per move (5)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="topping" value="Paneer" />Hourly (3)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="topping" value="Paneer" />Set Weekly (6)
                                                </div>
                                                <div className="topping pt-2">
                                                    <input type="checkbox" id="topping" name="topping" value="Paneer" />Salaried (2)
                                                </div>
                                                <div className="topping pt-2 ">
                                                    <input type="checkbox" id="topping" name="topping" value="Paneer" />Percent weight (1)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingfourty">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapsefourty" aria-expanded="true"
                                                aria-controls="collapsefourty">Minimum Age<i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapsefourty" className="collapse show"
                                        aria-labelledby="headingfourty" data-parent="#accordionExample">
                                        <div className="card-body">
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />18 (1)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />23 (28)
                                        </div>
                                         <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />24 (1)
                                        </div>'


                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="headingfivety">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapsefivety" aria-expanded="true"
                                                aria-controls="collapsefivety">Special Accommodations<i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapsefivety" className="collapse show"
                                        aria-labelledby="headingfivety" data-parent="#accordionExample">
                                         <div className="card-body">
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />Open to candidates with past felonies (6)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />Open to candidates with past misdemeanors (6)
                                        </div>
                                        
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="headingsixty">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapsesixty" aria-expanded="true"
                                                aria-controls="collapsesixty">Special Endorsements Required<i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapsesixty" className="collapse show"
                                        aria-labelledby="headingsixty" data-parent="#accordionExample">
                                        <div className="card-body">
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />TWIC (4)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />(H) Hazardous Materials (HAZMAT) (2)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />(N) Tank Vehicle(Tanker) (1)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />(X) Tanker/HAZMAT Combo (2)
                                        </div>
                                       

                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="headingseventy">
                                        <h4 className="clearfix mb-0">
                                            <a className="btn-3 btn-link" data-toggle="collapse"
                                                data-target="#collapsesedventy" aria-expanded="true"
                                                aria-controls="collapsesedventy">MVR Requirements<i
                                                    className="fa fa-angle-down"></i></a>
                                        </h4>
                                    </div>
                                    <div id="collapsesedventy" className="collapse show"
                                        aria-labelledby="headingseventy" data-parent="#accordionExample">
                                        <div className="card-body">
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />Clean MVR Only (19)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />Moving Violation Okay (2)
                                        </div>
                                        <div className="topping pt-2 ">
                                            <input type="checkbox" id="topping" name="topping" value="Paneer" />Non "At Fault" Accident Okay (8)
                                        </div>

                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </form>
            </div >
        </>
    )
}