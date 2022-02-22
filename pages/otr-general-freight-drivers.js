import Link from 'next/link';
import Layout from "../components/layouts";
import JobApply from "../components/apply"

export default function Apply() {
return (
<>
<section className="top-links-sec ort-general">
    <div className="container">
         <div className="row">
             <div className="col-md-9">
                 <div className="ort-inner">
                    <div className="media align-items-center bg-transparent border-0 p-0">
                        <a href="#" className="text-dark text-center text-decoration-none"> <img className="d-flex mr-4 truck-img mb-3" src="img/CTR-logo-cartoon.png" alt="" /> View all jobs <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></a>
                    
                        <div className="media-body">
                            <h6>Solo</h6>
                          <h4 className="mt-0">OTR General Freight Drivers <span className="" data-toggle="tooltip"
                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span> <span className="urgent">Urgent</span></h4>
                            <div className="job-date-author">
                                posted 3 days ago 
                               by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                            </div>
                            <div className="job-metas">
                                <div className="job-location d-flex align-items-center">
                                    <p className="pr-4"> <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Dallas, TX</p>
                                    <p><i className="fa fa-usd mr-2" aria-hidden="true"></i> $1300 - $1700 per week</p>  
                                </div>
                            </div>
                        </div>
                      </div>
                 </div>
             </div>
            <div className="col-md-3">
                 <div className="ort-btn mt-lg-4 mt-0">
                    <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> Apply Now <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-danger"> <i className="fa fa-star-o" aria-hidden="true"></i> Shortlist </button>
                </div>
              
                    <JobApply />
             
               
                 
            </div>
         </div>
    </div>
</section>

<div className="job-deatails-sec">
    <div className="container">
        <div className="row">
            <div className="col-lg-8">
                <div className="job-deatails-inner">
                    <h3>Job Description</h3>
                    <figure>
                        <img src="img/Freight1.jpg" alt="Trulli" className="img-fluid" />
                        <figcaption className="my-3 text-center">OTR General Freight Drivers</figcaption>
                      </figure>
                      
                      <p>Looking for OTR drivers for a company in Dallas, TX</p>
                      <p>1099 Position
                        1300-1700 ($78k annual)
                        $1k after 60 days
                        Contract percentage base 22-25% (Fuel expenses included in calculation)
                        Pay is weekly
                        Must be willing to be on the road for 10 days or more then home time
                        2-3 days off
                        routes: states that we run, primarily are: Texas, Arkansas, Oklahoma, Louisiana, Mississippi, Alabama, Georgia, the Carolinas, Tennessee, Kentucky, Missouri, and Pennsylvania.
                        HR can offer health insurance package
                        If they need to drive w companion, they offer companion insurance
                        Trucks come w inverters and small refrigerator. New bed
                        Freightliner 2015+
                        Take the truck w them when they go home
                        Will be partial contract work
                        Open to owner ops under their authority</p>

                        <p><strong>Requirements:</strong>
                            Willing to do some live unloads, some drop and hook
                            Willing to drive some dry van, some reefer (will provide reefer training if needed)
                            Must have at least 2 years of commercial driving experience
                            Must have Manual driving experience
                            Must have no felony charges
                            Ideally, must have clean record for the past 4 years
                            Must have class A CDL</p>
                </div>
                    <div className="share-links">
                        <span className="title mr-3">Share Link: </span>
                        <div className="social-share">
                            <i className="fa fa-facebook" aria-hidden="true"></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i className="fa fa-linkedin" aria-hidden="true"></i>
                            <i className="fa fa-pinterest-p" aria-hidden="true"></i>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </div>
                    </div>
                 <div className="related-job-sec">
                        <h3>Related Jobs</h3>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <div className="media align-items-center ">
                                    <label className="checkbox-inline" for="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>
                                        
                                      </label>
                                    <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt="" />
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                      <h4 className="mt-0">CDL-A Regional/OTR – No Touch Freight, Live Load/Unload<span className="d-block mt-2" data-toggle="tooltip"
                                        data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago 
                                           by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong>Accepting drivers from anywhere in the Illinois, Indiana, Michigan and Ohio</strong>                                
                                                </div>
                                        </div>
                                     
                                    </div>
                                    <button type="button" className="btn btn-outline-danger"><i className="fa fa-star-o m-0" aria-hidden="true"></i></button>
                
                                  </div>
                
                                  <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" for="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1" />
                                        
                                      </label>
                                    <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt="" />
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                      <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2)<span className="" data-toggle="tooltip"
                                        data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago 
                                           by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong>Accepting drivers from anywhere in Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North Dakota, Ohio, South Dakota and Wisconsin</strong>                                
                                                </div>
                                        </div>
                                     
                                    </div>
                                    <button type="button" className="btn btn-outline-danger"><i className="fa fa-star-o m-0" aria-hidden="true"></i></button>
                
                                  </div>
                                  <div className="media align-items-center shadow-sm">
                                    <label className="checkbox-inline" for="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1" />
                                        
                                      </label>
                                    <img className="d-flex mr-4 truck-img" src="img/ACWNCW-logo_PNG.jpg" alt="" />
                                    <div className="media-body">
                                        <span className="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                      <h4 className="mt-0">CDL-A Home Daily – Roll Off Container Trucks<span className="" data-toggle="tooltip"
                                        data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div className="job-date-author">
                                            posted 3 days ago 
                                           by <a href="" className="employer text-theme">National Concrete Washout</a>
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location">
                                                <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Bloomington, CA and Fort Worth, TX
                                            </div>
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong>Accepting drivers from anywhere in the CaliforniaTexas</strong>                                
                                                </div>
                                        </div>
                                     
                                    </div>
                                    <button type="button" className="btn btn-outline-danger"><i className="fa fa-star-o m-0" aria-hidden="true"></i></button>
                
                                  </div>
                            </div>
                        </div>
                  </div>
            </div>
            <div className="col-lg-4">
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
            </div>
        </div>
    </div>
</div>












</>
    )
}

Apply.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}