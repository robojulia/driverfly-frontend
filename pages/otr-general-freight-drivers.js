import axios from "axios"
import JobApply from "../components/apply"
import JobDescription from '../components/job-description/JobDescription'
import JonInformation from '../components/job-information-sidebar/JobInformation'
import Layout from "../components/layouts"
import RelatedJobs from '../components/related-jobs/Related-Jobs'
import SocilShare from '../components/share-link/ShareLink'

export default function Apply ( { data } ) {
  // console.log(data);
  const jobDetail = data

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
                    <h4 className="mt-0">{jobDetail.title} <span className="" data-toggle="tooltip"
                      data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span> <span className="urgent">{jobDetail.work_type}</span></h4>
                    <div className="job-date-author">
                      posted 3 days ago
                      by <a href="" className="employer text-theme">{jobDetail.complany_name}</a>
                    </div>
                    <div className="job-metas">
                      <div className="job-location d-flex align-items-center">
                        <p className="pr-4"> <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>{jobDetail.location}</p>
                        <p><i className="fa fa-usd mr-2" aria-hidden="true"></i> ${jobDetail.min_weekely_pay} - ${jobDetail.max_weekely_pay} per week</p>
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
              < JobDescription job={jobDetail} />
              < SocilShare />
              < RelatedJobs />
            </div>
            <div className="col-lg-4">
              < JonInformation job={jobDetail} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export async function getServerSideProps () {
  // Fetch data from external API
  // const { data } = await axios.get( 'http://localhost:3000/job' )
  const data = {
    title: "Class A CDL OTR Truck Drivers (W-2)",
    description: "1099 Position 1300-1700 ($78k annual) $1k after 60 days Contract percentage base 22-25% (Fuel expenses included in calculation) Pay is weekly Must be willing to be on the road for 10 days or more then home time 2-3 days off routes: states that we run, primarily are: Texas, Arkansas, Oklahoma, Louisiana, Mississippi, Alabama, Georgia, the Carolinas, Tennessee, Kentucky, Missouri, and Pennsylvania. HR can offer health insurance package If they need to drive w companion, they offer companion insurance Trucks come w inverters and small refrigerator. New bed Freightliner 2015+ Take the truck w them when they go home Will be partial contract work Open to owner ops under their authority",
    location: "Lahore, Pk",
    areas_covered: "don't know",
    delivery_type: "home delivery",
    work_type: "work type",
    employment_type: "employment type",
    job_type: "job type",
    drivers_from: "kasur",
    truck_image: "https://image.shutterstock.com/image-photo/truck-container-on-highway-cargo-260nw-1197587089.jpg",
    license_type: "LTV",
    equipment_type: "bazoka",
    schedule: "out of schedule",
    pay_structure: "pay structure",
    min_weekely_pay: 4000,
    max_weekely_pay: 20000,
    application_dead_line: "october",
    max_rate_per_mile: 34,
    min_rate_per_mile: 12,
    min_age: 18,
    complany_name: "company name",
    special_accomodations: "accomodations goes here",
    job_apply_type: "job apply type here",
    endoresements_type: "endorse him",
    mvr_requirements: "rquireemnts",
    friendle_address: "address of lahore",
    map_location: "lahore location",
    latitude: 31.515650187764656,
    longitude: 74.36322077934418
  }
  return { props: { data } }
}

Apply.getLayout = function getLayout ( page ) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}