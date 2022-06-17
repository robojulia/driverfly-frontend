import React, { useEffect, useState } from 'react'
import { StarFill, Link45deg, PhoneFlip, Mailbox2, Bell, ArrowRight } from 'react-bootstrap-icons';
import Layout from '../../components/layouts';
import CompanyInfo from '../../components/employer/CompanyInfo';
import CompanyJob from '../../components/employer/CompanyJob';
import ContactForm from '../../components/employer/ContactForm';
import ReviewForm from '../../components/employer/ReviewForm';
import CompanyApi from "../api/company"
import DocumentApi from "../api/document"
import { useTranslation } from '../../hooks/useTranslation';
import JobApi from '../api/job';
import Link from 'next/link';

export default function CompanyDetail({ company, jobs }) {

  const { t } = useTranslation();
  const documentApi = new DocumentApi(company.id)
  const [companyPhoto, setCompanyPhoto] = useState("/driverfly-logo-square.png")

  useEffect(async () => {
    if (company.photo?.id)
      await documentApi.getSignedUrl(company.photo?.id)
        .then(data => setCompanyPhoto(data))
        .catch(error => console.error("error", error))
  }, [company])

  return (
    <>
      <section className='bg-light py-4 pt-5'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 col-lg-8 col-sm-12'>
              <div className="row g-0 ">
                <div className="col-md-4  col-lg-4 col-sm-4 text-center shadow p-3  bg-white rounded">
                  <img src={companyPhoto}
                    className="img-fluid rounded-start"
                    alt="..." />
                </div>
                <div className="col-md-8 col-lg-8 col-sm-8 ">
                  <div className="card-body">
                    <div className='d-flex align-items-center'>
                      <h1 className='custom-trucker-title mx-2'>{company.name}</h1>
                      <span data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
                        {/* <StarFill color='#2da2af' /> */}
                      </span>
                    </div>
                    {/* <div className='d-flex my-3'>
                      <a>
                        <Link45deg color='#2da2af' className='mx-1' /> https://ctrecruiting.com
                      </a>
                      <a className='ml-5'>
                        <PhoneFlip color='#2da2af' className='mx-1' /> (213) 915-8025
                      </a>
                    </div> */}
                    {/* <a>
                      <Mailbox2 color='#2da2af' className='mx-1' />info@ctrecruiting.com
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4  col-lg-4 col-sm-12'>
              <div>
                <div className='my-3'>
                  <button type="button" className="custom-trucker-follow-btn">
                    <Bell color='#fff' className='mx-2' size={20} />{t('FOLLOW_US')}</button>
                </div>
                <div>
                  <button type="button" className="custom-trucker-review-btn">
                    {t('ADD_REVIEW')}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
      <section className='my-4'>
        <div className='container'>
          <CompanyInfo company={company} jobsPosted={jobs.length} />
          <div className='row'>
            <div className='col-md-8 col-sm-12 col-lg-8'>
              <Link href={`/find-jobs?companyId=${company.id}`}>
                <a className='text-dark text-center text-decoration-none'>
                  {t('view_all_jobs')} <ArrowRight className="pl-1" />
                </a>
              </Link>
              <CompanyJob jobs={jobs} />
              {/* <ReviewForm /> */}
            </div>
            <div className='col-md-4 col-sm-12 col-lg-4'>
              {/* <ContactForm /> */}
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

    if (!!!id)
      return { notFound: true }

    const companyApi = new CompanyApi();
    const data = id ? await companyApi.employer.getById(id) : []
    if (!!!data)
      return { notFound: true }

    const { items } = await new JobApi().search({ companyId: id, take: 3 });
    return { props: { company: data, jobs: items } }
  } catch (error) {
    console.error("Exception is here:", error);
    return { props: { company: [], jobs: [] } }
  }
}

CompanyDetail.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )

};
