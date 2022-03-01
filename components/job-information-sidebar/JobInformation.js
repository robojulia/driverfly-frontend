export default function JonInformation() {

    return (
        <>
            <div className="sidebar">
                <h3>Job Information</h3>
                <div className="sidebar-inner">
                    <ul className="list">
                        <li>
                            <div className="icon">
                                <i className="fa fa-usd" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Offered Salary</div>
                                <div className="value">$<span className="price-text">1300</span> - $<span className="price-text">1700</span> per week</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Areas Covered</div>
                                <div className="value"> OTR</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">    </div>
                            <div className="details">
                                <div className="text">Full-time/Part-time</div>
                                <div className="value">Full-time</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                            </div>
                            <div className="details">
                                <div className="text">Employment Type</div>
                                <div className="value">1099</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="fa fa-user-o" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Type of Delivery</div>
                                <div className="value"> Drop-and-hook</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="fa fa-user-o" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Accepting Drivers From...</div>
                                <div className="value"> Texas</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                            </div>
                            <div className="details">
                                <div className="text">Equipment Type</div>
                                <div className="value"> Dry van, Reefer</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="fa fa-user-o" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Schedule</div>
                                <div className="value">Other</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="fa fa-user-o" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Pay Structure</div>
                                <div className="value"> Percent per move, Set Weekly</div>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <i className="fa fa-user-o" aria-hidden="true"></i>
                            </div>
                            <div className="details">
                                <div className="text">Minimum Age</div>
                                <div className="value">23</div>
                            </div>
                        </li>

                        <li>
                            <div className="icon">
                            </div>
                            <div className="details">
                                <div className="text">MVR Requirements</div>
                                <div className="value"> Non "At Fault" Accident Okay</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="job-detail-statistic">
                    <div className="statistic-item flex-middle">
                        <div className="icon text-theme">
                            <i className="fa fa-file-archive-o" aria-hidden="true"></i>
                        </div>
                        <span className="text"><span className="number">2 weeks</span> ago</span>
                    </div>

                    <div className="statistic-item flex-middle">
                        <div className="icon text-theme">
                            <i className="fa fa-file-archive-o" aria-hidden="true"></i>
                        </div>
                        <span className="text"><span className="number">143</span> Views</span>
                    </div>

                    <div className="statistic-item flex-middle">
                        <div className="icon text-theme">
                            <i className="fa fa-file-archive-o" aria-hidden="true"></i>
                        </div>
                        <span className="text"><span className="number">2</span> Applicants</span>
                    </div>
                </div>
                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> Apply Now <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
                <div className="socials-apply clearfix">
                    <div className="title">OR apply with</div>
                    <div className="inner">
                        <div className="facebook-apply-btn-wrapper">
                            <a className="facebook-apply-btn" href="#" data-job_id="5363"><i className="fa fa-facebook"></i> Facebook</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}