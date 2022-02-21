import Link from 'next/link';
import Layout from "../components/layouts";
import JobApply from "../components/apply"
export default function Apply() {
return (
<>
<section class="top-links-sec ort-general">
    <div class="container">
         <div class="row">
             <div class="col-md-9">
                 <div class="ort-inner">
                    <div class="media align-items-center bg-transparent border-0 p-0">
                        <a href="#" class="text-dark text-center text-decoration-none"> <img class="d-flex mr-4 truck-img mb-3" src="img/CTR-logo-cartoon.png" alt="" /> View all jobs <i class="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></a>
                    
                        <div class="media-body">
                            <h6>Solo</h6>
                          <h4 class="mt-0">OTR General Freight Drivers <span class="" data-toggle="tooltip"
                            data-placement="top" title="Tooltip on top"> <i class="fa fa-star" aria-hidden="true"></i> </span> <span class="urgent">Urgent</span></h4>
                            <div class="job-date-author">
                                posted 3 days ago 
                               by <a href="" class="employer text-theme">Custom Trucker Recruiting</a>
                            </div>
                            <div class="job-metas">
                                <div class="job-location d-flex align-items-center">
                                    <p class="pr-4"> <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>Dallas, TX</p>
                                    <p><i class="fa fa-usd mr-2" aria-hidden="true"></i> $1300 - $1700 per week</p>  
                                </div>
                            </div>
                        </div>
                      </div>
                 </div>
             </div>
            <div class="col-md-3">
                 <div class="ort-btn mt-lg-4 mt-0">
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> Apply Now <i class="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
                    <button type="button" class="btn btn-danger"> <i class="fa fa-star-o" aria-hidden="true"></i> Shortlist </button>
                </div>
                <JobApply />
                 
            </div>
         </div>
    </div>
</section>

<div class="job-deatails-sec">
    <div class="container">
        <div class="row">
            <div class="col-lg-8">
                <div class="job-deatails-inner">
                    <h3>Job Description</h3>
                    <figure>
                        <img src="img/Freight1.jpg" alt="Trulli" class="img-fluid" />
                        <figcaption class="my-3 text-center">OTR General Freight Drivers</figcaption>
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
                    <div class="share-links">
                        <span class="title mr-3">Share Link: </span>
                        <div class="social-share">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                            <i class="fa fa-linkedin" aria-hidden="true"></i>
                            <i class="fa fa-pinterest-p" aria-hidden="true"></i>
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </div>
                    </div>
                 <div class="related-job-sec">
                        <h3>Related Jobs</h3>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="media align-items-center ">
                                    <label class="checkbox-inline" for="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1"/>
                                        
                                      </label>
                                    <img class="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt="" />
                                    <div class="media-body">
                                        <span class="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                      <h4 class="mt-0">CDL-A Regional/OTR – No Touch Freight, Live Load/Unload<span class="d-block mt-2" data-toggle="tooltip"
                                        data-placement="top" title="Tooltip on top"> <i class="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div class="job-date-author">
                                            posted 3 days ago 
                                           by <a href="" class="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div class="job-metas">
                                            <div class="job-location">
                                                <i class="fa fa-star-o" aria-hidden="true"></i><strong>Accepting drivers from anywhere in the Illinois, Indiana, Michigan and Ohio</strong>                                
                                                </div>
                                        </div>
                                     
                                    </div>
                                    <button type="button" class="btn btn-outline-danger"><i class="fa fa-star-o m-0" aria-hidden="true"></i></button>
                
                                  </div>
                
                                  <div class="media align-items-center shadow-sm">
                                    <label class="checkbox-inline" for="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1" />
                                        
                                      </label>
                                    <img class="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt="" />
                                    <div class="media-body">
                                        <span class="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                      <h4 class="mt-0">Class A CDL OTR Truck Drivers (W-2)<span class="" data-toggle="tooltip"
                                        data-placement="top" title="Tooltip on top"> <i class="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div class="job-date-author">
                                            posted 3 days ago 
                                           by <a href="" class="employer text-theme">Custom Trucker Recruiting</a>
                                        </div>
                                        <div class="job-metas">
                                            <div class="job-location">
                                                <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>Burnsville, MN
                                            </div>
                                            <div class="job-location">
                                                <i class="fa fa-star-o" aria-hidden="true"></i><strong>Accepting drivers from anywhere in Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North Dakota, Ohio, South Dakota and Wisconsin</strong>                                
                                                </div>
                                        </div>
                                     
                                    </div>
                                    <button type="button" class="btn btn-outline-danger"><i class="fa fa-star-o m-0" aria-hidden="true"></i></button>
                
                                  </div>
                                  <div class="media align-items-center shadow-sm">
                                    <label class="checkbox-inline" for="remember">
                                        <input type="checkbox" name="remember" id="remember" value="1" />
                                        
                                      </label>
                                    <img class="d-flex mr-4 truck-img" src="img/ACWNCW-logo_PNG.jpg" alt="" />
                                    <div class="media-body">
                                        <span class="urgent">URGENT</span>
                                        <h6>Solo</h6>
                                      <h4 class="mt-0">CDL-A Home Daily – Roll Off Container Trucks<span class="" data-toggle="tooltip"
                                        data-placement="top" title="Tooltip on top"> <i class="fa fa-star" aria-hidden="true"></i> </span></h4>
                                        <div class="job-date-author">
                                            posted 3 days ago 
                                           by <a href="" class="employer text-theme">National Concrete Washout</a>
                                        </div>
                                        <div class="job-metas">
                                            <div class="job-location">
                                                <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>Bloomington, CA and Fort Worth, TX
                                            </div>
                                            <div class="job-location">
                                                <i class="fa fa-star-o" aria-hidden="true"></i><strong>Accepting drivers from anywhere in the CaliforniaTexas</strong>                                
                                                </div>
                                        </div>
                                     
                                    </div>
                                    <button type="button" class="btn btn-outline-danger"><i class="fa fa-star-o m-0" aria-hidden="true"></i></button>
                
                                  </div>
                            </div>
                        </div>
                  </div>
            </div>
            <div class="col-lg-4">
                 <div class="sidebar">
                     <h3>Job Information</h3>
                     <div class="sidebar-inner">
                        <ul class="list">        
                            <li>
                                <div class="icon">
                                    <i class="fa fa-usd" aria-hidden="true"></i>
                                </div>
                                <div class="details">
                                    <div class="text">Offered Salary</div>
                                    <div class="value">$<span class="price-text">1300</span> - $<span class="price-text">1700</span> per week</div>
                                </div>
                            </li>          
                                <li>
                                     <div class="icon">                                        
                                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                                        </div>
                                        <div class="details">
                                            <div class="text">Areas Covered</div>
                                            <div class="value"> OTR</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    </div>
                                        <div class="details">
                                            <div class="text">Full-time/Part-time</div>
                                            <div class="value">Full-time</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                        </div>
                                        <div class="details">
                                            <div class="text">Employment Type</div>
                                            <div class="value">1099</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                            <i class="fa fa-user-o" aria-hidden="true"></i>
                                        </div>
                                        <div class="details">
                                            <div class="text">Type of Delivery</div>
                                            <div class="value"> Drop-and-hook</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                            <i class="fa fa-user-o" aria-hidden="true"></i>
                                        </div>
                                        <div class="details">
                                            <div class="text">Accepting Drivers From...</div>
                                            <div class="value"> Texas</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                        </div>
                                        <div class="details">
                                            <div class="text">Equipment Type</div>
                                            <div class="value"> Dry van, Reefer</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                            <i class="fa fa-user-o" aria-hidden="true"></i>
                                        </div>
                                        <div class="details">
                                            <div class="text">Schedule</div>
                                            <div class="value">Other</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                            <i class="fa fa-user-o" aria-hidden="true"></i>
                                        </div>
                                        <div class="details">
                                            <div class="text">Pay Structure</div>
                                            <div class="value"> Percent per move, Set Weekly</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="icon">    
                                            <i class="fa fa-user-o" aria-hidden="true"></i>
                                        </div>
                                        <div class="details">
                                            <div class="text">Minimum Age</div>
                                            <div class="value">23</div>
                                        </div>
                                    </li>
                
                                    <li>
                                        <div class="icon">    
                                        </div>
                                        <div class="details">
                                            <div class="text">MVR Requirements</div>
                                            <div class="value"> Non "At Fault" Accident Okay</div>
                                        </div>
                                    </li>
                           </ul>
                     </div>

                            <div class="job-detail-statistic">
                                <div class="statistic-item flex-middle">
                                    <div class="icon text-theme">
                                        <i class="fa fa-file-archive-o" aria-hidden="true"></i>
                                    </div>
                                    <span class="text"><span class="number">2 weeks</span> ago</span>
                               </div>
                        
                                <div class="statistic-item flex-middle">
                                    <div class="icon text-theme">
                                        <i class="fa fa-file-archive-o" aria-hidden="true"></i>
                                    </div>
                                    <span class="text"><span class="number">143</span> Views</span>
                               </div>
                        
                                <div class="statistic-item flex-middle">
                                    <div class="icon text-theme">
                                        <i class="fa fa-file-archive-o" aria-hidden="true"></i>
                                    </div>
                                    <span class="text"><span class="number">2</span> Applicants</span>
                              </div>
                         </div>
                         <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> Apply Now <i class="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
                         <div class="socials-apply clearfix">
                            <div class="title">OR apply with</div>
                            <div class="inner">
                                    <div class="facebook-apply-btn-wrapper">
                                        <a class="facebook-apply-btn" href="#" data-job_id="5363"><i class="fa fa-facebook"></i> Facebook</a>
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