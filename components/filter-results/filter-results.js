
export default function FilterResults() {
    return (
        <>
              <div className="col-md-3">
                            <h3>Filter Results</h3>
                            <form action="">
                                <label className="heading-label my-4">Search Keywords </label>
                                <input type="text" className="form-control shadow-sm" placeholder="e.g. web design"/>
                                <div className="bs-example">
                                    <div className="tab-content">
                                        <div className="accordion bg-transparent" id="accordionExample">

                                            <div className="card">
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
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck1"/>
                                                            <label className="custom-control-label" htmlFor="customCheck1">Class
                                                                A CDL(30)</label>
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
                                                               placeholder="All Location"/>
                                                        <label htmlFor="customRange1" className="range-sl">Radius: 50
                                                            miles</label>
                                                        <input type="range" className="custom-range" id="customRange1"/>
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
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio1" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio1">Toggle
                                                                this custom radio</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio2" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio2">Or
                                                                toggle this other custom radio</label>
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
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Rate
                                                                per mile (9)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Percent
                                                                per move (5)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4">Hourly
                                                                (3)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Set
                                                                Weekly (7)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck6"/>
                                                            <label className="custom-control-label" htmlFor="customCheck6">Salaried
                                                                (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck7"/>
                                                            <label className="custom-control-label" htmlFor="customCheck7">Percent
                                                                weight (1)</label>
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
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio3" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                 htmlFor="customRadio3">Monthly</label>

                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio4" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                 htmlFor="customRadio4">Weekly</label>

                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio5" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                 htmlFor="customRadio5">Daily</label>

                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio6" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                 htmlFor="customRadio6">Hourly</label>

                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio7" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                 htmlFor="customRadio7">Yearly</label>

                                                        </div>
                                                        <div className="rangeslider">
                                                            <input className="min" name="range_1" type="range" min="1"
                                                                   max="95000" value="18"/>
                                                            <input className="max" name="range_1" type="range" min="1"
                                                                   max="95000" value="95000"/>
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
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio8" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio8">Last
                                                                Hour</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio9" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio9">Last
                                                                24 hours</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio10" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio10">Last
                                                                7 days</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio11" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio11">Last
                                                                14 days</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio12" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio12">Last
                                                                30 days</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio13" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                 htmlFor="customRadio13">All</label>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="headingSeven">
                                                    <h4 className="clearfix mb-0">
                                                        <a className="btn-3 btn-link" data-toggle="collapse"
                                                           data-target="#collapseSeven" aria-expanded="true"
                                                           aria-controls="collapseSeven">Equipment Type<i
                                                            className="fa fa-angle-down"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapseSeven" className="collapse show"
                                                     aria-labelledby="headingSeven" data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Tractor
                                                                trailer (13)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Flatbed
                                                                (5))</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4">Hourly
                                                                (3)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Auto
                                                                hauling (1)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck6"/>
                                                            <label className="custom-control-label" htmlFor="customCheck6">Boxtruck
                                                                (1)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck7"/>
                                                            <label className="custom-control-label" htmlFor="customCheck7">Bus
                                                                (1)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck7"/>
                                                            <label className="custom-control-label" htmlFor="customCheck7">Concrete
                                                                Mixer (1)</label>
                                                        </div>
                                                        <span id="dots"></span><span id="more">
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                          </div>

                                                                      </span>
                                                        <button onClick="myFunction()" className="bg-transparent show-more"
                                                                id="myBtn">Show More +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="headingEight">
                                                    <h4 className="clearfix mb-0">
                                                        <a className="btn-3 btn-link" data-toggle="collapse"
                                                           data-target="#collapseEight" aria-expanded="true"
                                                           aria-controls="collapseEight">Accepting Drivers From...<i
                                                            className="fa fa-angle-down"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapseEight" className="collapse show"
                                                     aria-labelledby="headingEight" data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Anywhere
                                                                in the US (4)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Alabama
                                                                (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4">Arizona
                                                                (1)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">California
                                                                (6)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck6"/>
                                                            <label className="custom-control-label" htmlFor="customCheck6">Connecticut
                                                                (1)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck7"/>
                                                            <label className="custom-control-label" htmlFor="customCheck7">Delaware
                                                                (1)</label>
                                                        </div>
                                                        <span id="dots"></span><span id="more">
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                            <input type="checkbox"
                                                                                   className="custom-control-input"
                                                                                   id="customCheck1"/>
                                                                            <label className="custom-control-label"
                                                                                 htmlFor="customCheck1">Check this custom checkbox</label>
                                                                          </div>

                                                                      </span>
                                                        <button onClick="myFunction()" className="bg-transparent show-more"
                                                                id="myBtn">Show More +
                                                        </button>

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
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Local
                                                                (5)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Regional
                                                                (7)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4">OTR
                                                                (12)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Cross
                                                                Border (1)</label>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="headingTen">
                                                    <h4 className="clearfix mb-0">
                                                        <a className="btn-3 btn-link" data-toggle="collapse"
                                                           data-target="#collapseTen" aria-expanded="true"
                                                           aria-controls="collapseTen">Type of Delivery <i
                                                            className="fa fa-angle-down"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapseTen" className="collapse show" aria-labelledby="headingTen"
                                                     data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Touch
                                                                (1)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">No
                                                                Touch (8)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4">Drop-and-hook
                                                                (4)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Dedicated
                                                                Lanes (1)</label>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="headingEelven">
                                                    <h4 className="clearfix mb-0">
                                                        <a className="btn-3 btn-link" data-toggle="collapse"
                                                           data-target="#collapseEelven" aria-expanded="true"
                                                           aria-controls="collapseEelven">Schedule <i
                                                            className="fa fa-angle-down"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapseEelven" className="collapse show"
                                                     aria-labelledby="headingEelven" data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio14" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio14">Multiple
                                                                weeks on the road (2)</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio15" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio15">Most
                                                                weekends off (2)</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio16" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio16">Weekends
                                                                off (4)</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio17" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio17">Other
                                                                (9)</label>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="headingthirty">
                                                    <h4 className="clearfix mb-0">
                                                        <a className="btn-3 btn-link" data-toggle="collapse"
                                                           data-target="#collapsethirty" aria-expanded="true"
                                                           aria-controls="collapsethirty">Pay Structure<i
                                                            className="fa fa-angle-down"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapsethirty" className="collapse show"
                                                     aria-labelledby="headingthirty" data-parent="#Structure">
                                                    <div className="card-body">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Rate
                                                                per mile (9)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Percent
                                                                per move (5)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4">Hourly
                                                                (3)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Set
                                                                Weekly (7)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Salaried
                                                                (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5">Percent
                                                                weight (1)</label>
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
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio18" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio18">23
                                                                (18)</label>
                                                        </div>
                                                        <div className="custom-control custom-radio">
                                                            <input type="radio" id="customRadio19" name="customRadio"
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor="customRadio19">24
                                                                (1)</label>

                                                        </div>


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
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Open
                                                                to candidates with past felonies (5)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Open
                                                                to candidates with past felonies (5)</label>

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
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">TWIC
                                                                (4)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">(H)
                                                                Hazardous Materials (HAZMAT) (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">(X)
                                                                Tanker/HAZMAT Combo (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">(T)
                                                                Double/Triples (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">N/A
                                                                (5)</label>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="headingseventy">
                                                    <h4 className="clearfix mb-0">
                                                        <a className="btn-3 btn-link" data-toggle="collapse"
                                                           data-target="#collapseseventy" aria-expanded="true"
                                                           aria-controls="collapseseventy">MVR Requirements<i
                                                            className="fa fa-angle-down"></i></a>
                                                    </h4>
                                                </div>
                                                <div id="collapseseventy" className="collapse show"
                                                     aria-labelledby="headingseventy" data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Clean
                                                                MVR Only (10)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Moving
                                                                Violation Okay (2)</label>
                                                            <input type="checkbox" className="custom-control-input"
                                                                   id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3">Non
                                                                "At Fault" Accident Okay (7)</label>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
        </>
        )
}