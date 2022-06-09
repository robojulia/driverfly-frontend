import React from 'react'
import { StarFill, Link45deg, PhoneFlip, Mailbox2, Bell } from 'react-bootstrap-icons';
import Layout from '../../components/layouts';
import CompanyInfo from './CompanyInfo';
import CompanyJob from './CompanyJob';
import ContactForm from './ContactForm';
import ReviewForm from './ReviewForm';
export default function customTruckerRecruiting() {
  return (
    <>
      <section className='bg-light py-4'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 col-lg-8 col-sm-12'>
              <div className="row g-0 ">
                <div className="col-md-4  col-lg-4 col-sm-4 text-center shadow p-3  bg-white rounded">
                  <img src='../../img/CTR-logo-cartoon.png' className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8 col-lg-8 col-sm-8 ">
                  <div className="card-body">
                    <div className='d-flex align-items-center'>
                      <h1 className='custom-trucker-title mx-2'>Custom Trucker Recruiting</h1>
                      <span data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
                        <StarFill color='#2da2af' /> </span>
                    </div>
                    <div className='d-flex my-3'>
                      <a>
                        <Link45deg color='#2da2af' className='mx-1' /> https://ctrecruiting.com
                      </a>
                      <a className='ml-5'>
                        <PhoneFlip color='#2da2af' className='mx-1' /> (213) 915-8025
                      </a>
                    </div>
                    <a>
                      <Mailbox2 color='#2da2af' className='mx-1' />info@ctrecruiting.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4  col-lg-4 col-sm-12'>
              <div>
                <div className='my-3'>
                  <button type="button" className="custom-trucker-follow-btn">
                    <Bell color='#fff' className='mx-2' size={20} />Follow us</button>
                </div>
                <div>
                  <button type="button" className="custom-trucker-review-btn">
                    Add a review</button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
      <section className='my-4'>
        <div className='container'>
          <CompanyInfo/>
          <div className='row'>
            <div className='col-md-8 col-sm-12 col-lg-8'>
              <CompanyJob />
              <ReviewForm />
            </div>
            <div className='col-md-4 col-sm-12 col-lg-4'>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

    </>
  )

}

customTruckerRecruiting.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )

};
