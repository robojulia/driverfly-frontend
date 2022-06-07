import { useRouter } from "next/router"
import { useState } from "react"
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
import { useTranslation } from "../../hooks/useTranslation"
import JobApi from "../api/job"
import CompanyPhoto from "../../components/jobs/company-photo"
import jobDetailContext from "../../context/jobDetailContext"
import StructuredData from "../../components/seo/StructuredData"
import { ArrowRight, GeoAltFill, CurrencyDollar } from "react-bootstrap-icons"
import { buildAddress } from "../../utils/common"

export default function Detail({ jobDetail, relatedJobs }) {

  const { t } = useTranslation();
  console.log(jobDetail);

  return (
    <>
      <ToastContainer />
      <StructuredData type="JobPosting" data={StructuredData.JobPosting(jobDetail, t)} />
      <section className="top-links-sec ort-general">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="ort-inner">
                <div className="media align-items-center bg-transparent border-0 p-0">
                  <span className="text-dark text-center text-decoration-none">
                    <CompanyPhoto className="d-flex mr-4 truck-img mb-3" company={jobDetail.company} />
                    <Link href="/find-jobs">
                      <a>
                        {t('view_all_jobs')} <ArrowRight className="pl-1" />
                      </a>
                    </Link>
                  </span>
                  <div className="media-body">
                    {/* <h6>Solo</h6> */}
                    <h4 className="mt-0">
                      {jobDetail.title}
                      <span className="" data-toggle="tooltip"
                        data-placement="top" title={jobDetail.title}>
                      </span>
                    </h4>
                    <div className="job-date-author">
                      {
                        jobDetail.created_at &&
                        <>
                          {t('posted')} {timeSince(jobDetail.created_at)} {t('ago')}
                        </>
                      } {
                        jobDetail?.company?.name &&
                        <>
                          {t('by')} <span role="button" className="employer text-theme">{jobDetail.company?.name}</span>
                        </>
                      }
                    </div>
                    <div className="job-metas">
                      <div className="job-location d-flex align-items-center">
                        {
                          jobDetail.location &&
                          <p className="pr-4">
                            < GeoAltFill className="mr-1" />
                            {buildAddress(jobDetail.location)}
                          </p>
                        }
                      </div>
                      <div >
                        <p><CurrencyDollar />{jobDetail.min_weekly_pay ? jobDetail.min_weekly_pay : 0} - {jobDetail.max_weekly_pay ? jobDetail.max_weekly_pay : 0} {t('per week')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <JobApply job={jobDetail} />
            </div>
          </div>
        </div>

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
      </section>
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