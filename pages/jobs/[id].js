import { useRouter } from "next/router"
import axios from "axios"
import JobApply from "../../components/apply"
import JobDescription from '../../components/job-description/JobDescription'
import JonInformation from '../../components/job-information-sidebar/JobInformation'
import Layout from "../../components/layouts"
import RelatedJobs from '../../components/related-jobs/Related-Jobs'
import SocilShare from '../../components/share-link/ShareLink'
import timeSince from "../../utils/timeSince"
import { ToastContainer, toast } from 'react-toastify'

export default function Detail({ data }) {
  const jobDetail = data

  const router = useRouter()

  return (
    <>
      <ToastContainer />
      <section className="top-links-sec ort-general">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="ort-inner">
                <div className="media align-items-center bg-transparent border-0 p-0">
                  <a href="#" className="text-dark text-center text-decoration-none"> <img className="d-flex mr-4 truck-img mb-3" src="img/CTR-logo-cartoon.png" alt="" /> View all jobs <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></a>
                  <div className="media-body">
                    <h6>Solo</h6>
                    <h4 className="mt-0">
                      {jobDetail.title}
                      <span className="" data-toggle="tooltip"
                        data-placement="top" title="{jobDetail.title}">
                        <i className="fa fa-star" aria-hidden="true"></i>
                      </span>
                      <span className="urgent">
                        {jobDetail.work_type}
                      </span>
                    </h4>
                    <div className="job-date-author">
                      posted {timeSince(jobDetail.created_at)} ago
                      by <a href="" className="employer text-theme">{jobDetail.complany_name}</a>
                    </div>
                    <div className="job-metas">
                      <div className="job-location d-flex align-items-center">
                        <p className="pr-4"> <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>{jobDetail.location}</p>
                        <p><i className="fa fa-usd mr-2" aria-hidden="true"></i>{jobDetail.min_weekely_pay ? jobDetail.min_weekely_pay : 0} - {jobDetail.max_weekely_pay ? jobDetail.max_weekely_pay : 0} per week</p>
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
export async function getServerSideProps(context) {
  // Fetch data from external API
  const id = context.params.id;
  const { data } = await axios.get(`${process.env.BASE_URL_API}/jobs/${context.params.id}`)

  return { props: { data } }
}

Detail.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}