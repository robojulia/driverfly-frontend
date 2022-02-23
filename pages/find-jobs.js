import Link from 'next/link';
import Layout from "../components/layouts";
import FilterResult from '../components/filter-results/filter-results'

export default function FindJobs() {
    return (
        <>
            <div className="filter-sec">
                <div className="container">
                    <div className="row">
                        
                      < FilterResult />
                      
                        <div className="col-md-9 outer pl-4 ">

                            <form action="">
                                <div className="filter-inner d-flex align-items-baseline pl-lg-3 mt-lg-2 ml-lg-3">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                    <input type="text" className="form-control border-0 w-25" placeholder="Location"/>
                                    <span className="find-me"></span>
                                    <button type="submit" className="btn btn-danger btn-lg br-0 ">Search</button>
                                </div>
                            </form>

                            <div className="results-count mt-4 ">
                                Showing <span className="first">1</span> – <span className="last">10</span> of 32 results
                            </div>

                            <div className="filter-btn-groups mt-3">
                                <button type="button" className="btn btn-danger  "><i className="fa fa-envelope-o"
                                                                                  aria-hidden="true"></i> Get Jobs
                                    Alerts
                                </button>
                                <button type="button" className="btn btn-danger  "> Mass Job Apply</button>
                                <button type="button" className="btn btn-danger  "><i className="fa fa-wifi"
                                                                                  aria-hidden="true"></i>
                                    RSS Feed
                                </button>
                                <span className="text-secondary w-sm-25">Sort by:
                                          <select className="custom-select shadow-none mt-lg-0 mt-md-3">
                                            <option>Default</option>
                                            <option value="1">Newest</option>
                                            <option value="2">Oldest</option>
                                            <option value="3">Random</option>
                                          </select></span>

                            </div>
                            <div className="filter-outer mt-5">
                                <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" htmlFor="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>

                                    </label>
                                    <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt=""/>
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                        <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className=""
                                                                                                  data-toggle="tooltip"
                                                                                                  data-placement="top"
                                                                                                  title="Tooltip on top"> <i
                                            className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago
                                            by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas text-secondary
                                             text-secondary">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong
                                                className="text-secondary" className="text-secondary">Accepting drivers from
                                                anywhere in Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota,
                                                Missouri, Nebraska, North Dakota, Ohio, South Dakota and
                                                Wisconsin</strong>
                                            </div>
                                        </div>

                                    </div>
                                    <button type="button" className="btn btn-outline-danger">Browse Job</button>

                                </div>
                                <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" htmlFor="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>

                                    </label>
                                    <img className="d-flex mr-4 truck-img" src="img/DriverFly-Official-Favicon.png" alt=""/>
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                        <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className=""
                                                                                                  data-toggle="tooltip"
                                                                                                  data-placement="top"
                                                                                                  title="Tooltip on top"> <i
                                            className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago
                                            by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas text-secondary
                                            ">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong
                                                className="text-secondary">Accepting drivers from anywhere in Illinois,
                                                Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North
                                                Dakota, Ohio, South Dakota and Wisconsin</strong>
                                            </div>
                                        </div>

                                    </div>
                                    <button type="button" className="btn btn-outline-danger">Browse Job</button>

                                </div>
                                <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" htmlFor="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>

                                    </label>
                                    <img className="d-flex mr-4 truck-img" src="img/Hahn-Transportation-Inc-1.jpg" alt=""/>
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                        <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className=""
                                                                                                  data-toggle="tooltip"
                                                                                                  data-placement="top"
                                                                                                  title="Tooltip on top"> <i
                                            className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago
                                            by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas text-secondary
                                            ">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong
                                                className="text-secondary">Accepting drivers from anywhere in Illinois,
                                                Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North
                                                Dakota, Ohio, South Dakota and Wisconsin</strong>
                                            </div>
                                        </div>

                                    </div>
                                    <button type="button" className="btn btn-outline-danger">Browse Job</button>

                                </div>
                                <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" htmlFor="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>

                                    </label>
                                    <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt=""/>
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                        <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className=""
                                                                                                  data-toggle="tooltip"
                                                                                                  data-placement="top"
                                                                                                  title="Tooltip on top"> <i
                                            className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago
                                            by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas text-secondary
                                            ">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong
                                                className="text-secondary">Accepting drivers from anywhere in Illinois,
                                                Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North
                                                Dakota, Ohio, South Dakota and Wisconsin</strong>
                                            </div>
                                        </div>

                                    </div>
                                    <button type="button" className="btn btn-outline-danger">Browse Job</button>

                                </div>
                                <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" htmlFor="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>

                                    </label>
                                    <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt=""/>
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                        <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className=""
                                                                                                  data-toggle="tooltip"
                                                                                                  data-placement="top"
                                                                                                  title="Tooltip on top"> <i
                                            className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago
                                            by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas text-secondary
                                            ">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong
                                                className="text-secondary">Accepting drivers from anywhere in Illinois,
                                                Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North
                                                Dakota, Ohio, South Dakota and Wisconsin</strong>
                                            </div>
                                        </div>

                                    </div>
                                    <button type="button" className="btn btn-outline-danger">Browse Job</button>

                                </div>
                                <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" htmlFor="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>

                                    </label>
                                    <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt=""/>
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                        <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className=""
                                                                                                  data-toggle="tooltip"
                                                                                                  data-placement="top"
                                                                                                  title="Tooltip on top"> <i
                                            className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago
                                            by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas text-secondary
                                            ">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong
                                                className="text-secondary">Accepting drivers from anywhere in Illinois,
                                                Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North
                                                Dakota, Ohio, South Dakota and Wisconsin</strong>
                                            </div>
                                        </div>

                                    </div>
                                    <button type="button" className="btn btn-outline-danger">Browse Job</button>

                                </div>
                                <ul className="pagination ">
                                    <li>
                                        <span className="page-numbers current active">1</span>
                                    </li>
                                    <li>
                                        <a className="page-numbers" href="#">2</a>
                                    </li>
                                    <li>
                                        <a className="page-numbers" href="#">3</a>
                                    </li>
                                    <li>
                                        <a className="page-numbers" href="#">4</a>
                                    </li>
                                    <li>
                                        <a className="next page-numbers" href="#">Next <i
                                            className="fa fa-long-arrow-right ml-2" aria-hidden="true"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

FindJobs.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}