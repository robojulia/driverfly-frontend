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
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum"
import Link from 'next/link'
import { useTranslation } from "react-i18next"
import JobApi from "../api/job"

export default function Detail({ jobDetail, relatedJobs }) {

  const router = useRouter()
  const { t } = useTranslation();

  return (
    <>
      <ToastContainer />
      <section className="top-links-sec ort-general">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="ort-inner">
                <div className="media align-items-center bg-transparent border-0 p-0">
                  <Link href="/find-jobs">
                    <a href="#" className="text-dark text-center text-decoration-none">
                      <img className="d-flex mr-4 truck-img mb-3" src="/driverfly-logo-square.png" alt="" />
                      {t('view_all_jobs')} <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></a>
                  </Link>
                  <div className="media-body">
                    {/* <h6>Solo</h6> */}
                    <h4 className="mt-0">
                      {jobDetail.title}
                      <span className="" data-toggle="tooltip"
                        data-placement="top" title="{jobDetail.title}">
                      </span>
                    </h4>
                    <div className="job-date-author">
                      {t('posted')} {timeSince(jobDetail.created_at)} {t('ago')}
                      {t('by')} <span role="button" className="employer text-theme">{jobDetail.company?.name}</span>
                    </div>
                    <div className="job-metas">
                      <div className="job-location d-flex align-items-center">
                        {
                          jobDetail.location &&
                          <p className="pr-4">
                            <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>
                            <>
                              {jobDetail.location.street || 'NO Street'}, {jobDetail.location.city || ', NO City'}, {jobDetail.location.state || ', NO State'}, {jobDetail.location.zip_code || ', NO ZIP'},
                            </>
                          </p>
                        }
                        <p><i className="fa fa-usd mr-1" aria-hidden="true"></i>{jobDetail.min_weekly_pay ? jobDetail.min_weekly_pay : 0} - {jobDetail.max_weekly_pay ? jobDetail.max_weekly_pay : 0} {t('per week')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="ort-btn mt-lg-4 mt-0">
                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> {t('apply_now')} <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
                <button type="button" className="btn btn-danger"> <i className="fa fa-star-o" aria-hidden="true"></i> {t('shortlist')} </button>
              </div>
              {/* <JobApply /> */}
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
              < RelatedJobs jobs={relatedJobs} />
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
  try {
    const id = context.params?.id;
    const data = id ? await new JobApi().getById(id) : []
    const { items } = await new JobApi().search({ companyId: data.company?.id, take: 3 });
    return {
      props: { jobDetail: data, relatedJobs: items }
    }
  } catch (error) {
    console.error("Exception is here:", error);
    return { props: { jobDetail: [], relatedJobs: [] } }
  }
}

Detail.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}