import Head from 'next/head';
import Layout from "../components/layouts";

export default function Index() {
    return (
        <>
        <Head>
            <title>Home - DriverFly</title>
        </Head>

        <section className="hero-sec">
            <div className="container ">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="hero-inner">
                            <h1>Find The Job That Fits Your Life</h1>
                            <h2>Choose from thousands of CDL and Non-CDL truck driving jobs. Get hired fast. Start Searching.</h2>
                        </div>
                          <div className="hero-search">
                              
                            <div className="input-group w-25">
                                <div className="input-group-prepend">
                                 <i className="fa fa-search" aria-hidden="true"></i>
                                </div>
                                  <input type="text" className="" placeholder="Job Title or Keywords" aria-label="" aria-describedby="basic-addon1" />
                              </div>
                              <form action="">
                                <div className="filter-inner d-flex align-items-center pl-3">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        <input type="text" className="form-control border-0" placeholder="Location" />
                                    <span className="find-me"></span>
                                </div>
                             </form>
                             
                             <select className="form-control custom-sel" id="exampleFormControlSelect1">
                                 <option>All Types</option>
                                <option>Solo (27)</option>
                                <option>Team Drivers(4)</option>
                              </select>
                              <select className="form-control custom-sel border-0" id="exampleFormControlSelect1">
                                <option>All Categories</option>
                                <option> Class A CDL(30)</option>
                              </select>
                              <div className="form-group form-group-search m-0">
                                <button className="btn-submit btn btn-block btn-theme" type="submit">Search</button>
                            </div>
                          </div>
                        <div className="content-trending ">
                            <ul className="trending-keywords">
                                <li className="title">Trending Keywords:</li>
                                    <li className="item"><a href="#">Drivers,</a></li>
                                    <li className="item"><a href="#">CDL Driver,</a></li>
                                    <li className="item"><a href="#">Truck Drivers,</a></li>
                                    <li className="item"><a href="#">Truck Driving,</a></li>
                                    <li className="item"><a href="#">All CDL Jobs,</a></li>
                                    <li className="item"><a href="#">Trucking Jobs,</a></li>
                                    <li className="item"><a href="#">Class A CDL,</a></li>
                                    <li className="item"><a href="#">Class B CDL,</a></li>
                                    <li className="item"><a href="#">Local Driver,</a></li>
                                    <li className="item"><a href="#">Regional Drivers,</a></li>
                                    <li className="item"><a href="#">Over The Road,</a></li>
                                    <li className="item"><a href="#">OTR / Long Haul Truck Driver,</a></li>
                                    <li className="item"><a href="#">White Glove Delivery Drivers,</a></li>
                                    <li className="item"><a href="#">Drayage &amp; Intermodal Container,</a></li>
                                    <li className="item"><a href="#">Transport Drivers,</a></li>
                                    <li className="item"><a href="#">Owner Operator Truck Driver,</a></li>
                                    <li className="item"><a href="#">Heavy Towing,</a></li>
                                    <li className="item"><a href="#">Boxtruck Drivers,</a></li>
                                    <li className="item"><a href="#">Hazmat Certified Drivers,</a></li>
                                    <li className="item"><a href="#">Auto Hauling Drivers,</a></li>
                                    <li className="item"><a href="#">Construction Transport Haulers,</a></li>
                                    <li className="item"><a href="#">Logging Drivers,</a></li>
                                    <li className="item"><a href="#">Pick-Up &amp; Delivery Drivers</a></li>
                                </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="tab-sec">
            <div className="container">
                <div className="bs-example">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a href="#home" className="nav-link active" data-toggle="tab">
                                Featured Jobs</a>
                        </li>
                        <li className="nav-item">
                            <a href="#profile" className="nav-link" data-toggle="tab">
                                Recent Jobs </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="home">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">CDL-A Regional/OTR – No Touch Freight, Live Load/Unload<span className="d-block" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2) <span className="" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Burnsville, MN
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">OTR General Freight Drivers  <span className="" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Dallas, TX
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/ACWNCW-logo_PNG.jpg" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">CDL-A Home Daily – Roll Off Container Trucks <span className="d-block" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>National Concrete Washout</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Bloomington, CA and Fort Worth, TX
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">Class A CDL drivers – 1099 OTR position  <span className="" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Keys Transportation LLC</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Fontana, CA (LA area), Sumner, WA(Seattle area)
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">CDL-A Semi Truck OTR, No Touch Freight, Live Load/Unload <span className="d-block" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Atlanta, GA
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="tab-pane fade" id="profile">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">CDL-A Regional/OTR – No Touch Freight, Live Load/Unload<span className="d-block" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2) <span className="" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Burnsville, MN
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">OTR General Freight Drivers  <span className="" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Dallas, TX
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/ACWNCW-logo_PNG.jpg" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">CDL-A Home Daily – Roll Off Container Trucks <span className="d-block" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>National Concrete Washout</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Bloomington, CA and Fort Worth, TX
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">Class A CDL drivers – 1099 OTR position  <span className="" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Keys Transportation LLC</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Fontana, CA (LA area), Sumner, WA(Seattle area)
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media align-items-center ">
                                        <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                        <div className="media-body">
                                            <span className="urgent">URGENT</span>
                                            <h6>Solo</h6>
                                          <h4 className="mt-0">CDL-A Semi Truck OTR, No Touch Freight, Live Load/Unload <span className="d-block" data-toggle="tooltip"
                                            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    <strong>Custom Trucker Recruiting</strong>
                                                 </div>
                                                  <div className="job-location">
                                                    <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Atlanta, GA
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="driver-sec">
            <div className="container how-it-work-sec">
                <h3>How It Works</h3>
                <h3>Drivers</h3>
                
               <div className="row mb-4">
                   <div className="col-md-4">
                       <div className="card">
                           <i className="fa fa-file-archive-o" aria-hidden="true"></i>
                           <div className="card-body px-0">
                               <h5 className="card-title">Create An Account</h5>
                               <p className="card-text">Take 5 minutes to quickly set up a profile and upload your CDL / Medical card if available.</p>
                           </div>
                       </div>
                   </div>
                   <div className="col-md-4">
                       <div className="card">
                           <i className="fa fa-filter" aria-hidden="true"></i>
                           <div className="card-body px-0">
                               <h5 className="card-title">Filter & Search Driver Jobs</h5>
                               <p className="card-text">Browse hundreds of jobs based on your specific criteria, including driver schedule & other parameters.</p>
                           </div>
                       </div>
                   </div>
                   <div className="col-md-4">
                       <div className="card">
                           <i className="fa fa-paper-plane" aria-hidden="true"></i>
                           <div className="card-body px-0">
                               <h5 className="card-title">Save & Apply</h5>
                               <p className="card-text">Use the DriverFly platform to favorite jobs, forward to friends, and submit for application.</p>
                           </div>
                       </div>
                   </div>
                   <div className="col-md-4">
                    <div className="card">
                        <i className="fa fa-bell-o" aria-hidden="true"></i>
                        <div className="card-body px-0">
                            <h5 className="card-title">Have Jobs Come To You</h5>
                            <p className="card-text">You also have the ability to display your profile to prospective employers and set up push notifications (through RSS feeds) whenever a job matching your search criteria becomes available.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <i className="fa fa-trophy" aria-hidden="true"></i>
                        <div className="card-body px-0">
                            <h5 className="card-title">Get Hired</h5>
                            <p className="card-text">Employer will contact you directly to discuss the opportunity and their unique hiring steps.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <i className="fa fa-hand-peace-o" aria-hidden="true"></i>
                        <div className="card-body px-0">
                            <h5 className="card-title">Review Your Employer</h5>
                            <p className="card-text">Once you've landed your dream job, share your experience with the rest of the world.</p>
                        </div>
                    </div>
                </div>
               </div>

               <h3>Companies</h3>
               <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                        <div className="card-body px-0">
                            <h5 className="card-title">Post A Job</h5>
                            <p className="card-text">Post a job. We'll quickly match you with the right drivers.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <i className="fa fa-file-audio-o" aria-hidden="true"></i>
                        <div className="card-body px-0">
                            <h5 className="card-title">Search Drivers</h5>
                            <p className="card-text">Browse profiles, reviews, and proposals then interview top driver candidates.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        <div className="card-body px-0">
                            <h5 className="card-title">Hire</h5>
                            <p className="card-text">Extend an offer letter and conduct background checks/onboarding in accordance with the FMCSA.</p>
                        </div>
                    </div>
                </div>
            </div>
           </div>
        </section>

        <div className="testimonial-sec home-testominial">
            <div className="container">
                <h2 className="text-center">What Drivers Say About Us</h2>
                <div className="custom-tst pb-5">
                <div className="row owl-carousel owl-theme d-block" id="owl-demo">

                            <div className="item">
                                <div className="box">
                                    <i className="fa fa-quote-left" aria-hidden="true"></i>
                                    <img src="img/Robert-Driver.jpg" alt="" className="" />
                                    <h3>Robert Richards</h3>
                                    <span className="job text-theme">Tanker Hauler</span>
                                    <div className="description">Thanks guys you're awesome. Got a job and got moving in less than <br /> a week.</div>
                                </div>
                            </div>


                        <div className="item">
                            <div className="box">
                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                <img src="img/Lydia-Driver2.jpg" alt="" className="" />
                                <h3>Lydia Wright</h3>
                                <span className="job text-theme">Team Driver - OTR</span>
                                <div className="description">This site is amazing. I found my team driver through here as well as my first <br /> job out of CDL School.</div>
                            </div>
                        </div>


                        <div className="item">
                            <div className="box">
                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                <h3>Bill Townson</h3>
                                <span className="job text-theme">OTR Driver</span>
                                <div className="description">This is the best job-board I've used so far. It was easy to use and I was able to get a job in just days. Love that it's specific to the trucking industry.</div>
                            </div>
                        </div>

                  </div>
              </div>
            </div>
        </div>
    </>
    )
}

Index.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}