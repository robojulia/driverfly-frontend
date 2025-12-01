import Link from 'next/link';
import Head from 'next/head';
import { PublicLayout } from "../components/layouts/public-layout";
import BlogDetail from '../public/css/blog-detail.module.css'
import SocilShare from '../components/share-link/share-link';
export default function TipsBlog() {
  return (
    <>
      <Head>
        <title>{t("BLOG_TIPS_META_TITLE")}</title>
        <meta
          name="description"
          content={t("BLOG_TIPS_META_DESC")}
          key="desc"
        />
      </Head>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h1>The DriverFly On The Wall Blog</h1>
            {/* <Breadcrumbs /> */}
          </div>
        </div>
      </div>

      <div className={BlogDetail.job__deatails__sec}>
        <div className="container">
          <div className="row">
            <img src="img/driver-getting.jpg" className='w-100' />
            <p className='mt-3'>Tips and Tricks</p>
            <h2 className='font-weight-normal'> Finding Your Dream Trucking Job: 3 Quick & Easy Tips</h2>
            <div className="top-info mb-3">
              <a href="" className='text-secondary'><i className="fa fa-clock-o" aria-hidden="true"></i> October 8, 2021</a>
              <span className="comments">  <i className="fa fa-comment ml-4"></i>  0 Comments</span>
            </div>
            <p>It’s easy to find a trucking job quickly, but what about finding your dream trucking job? How do you find the one perfect for you?</p>
            <p>We know finding your dream trucking job is tiring and stressful, especially with the abundance of competitors in the trucking industry
              today, so we’ve come up with 3 quick and easy, yet extremely important, tips for you to find the best trucking job for you!</p>
            <p>First, DYOR. Yes, that’s right: Do Your Own Research! To find a job that fits your qualifications and preferences, you must first be
              familiar with the job market in the trucking industry.  Read up on trucking topics on <Link href='/blog'><a > blogs</a></Link> and forums
              and subscribe to newsletters, video channels, and famous social media platforms where you can easily get useful information and tips about trucking jobs. </p>
            <p>Second, get things organized. As simple as this sounds, it’s so helpful and will simplify your research and networking in the trucking industry. Listing
              down all your contacts in one place will make reaching out to employers so much easier.</p>
            <p>Lastly, make <Link href='https://ctrecruiting.com/apply-now'><a > Custom Trucker Recruiting</a></Link> and <Link href='/'><a > DriverFly</a></Link> your
              best friend! We’ll match you with jobs that fit both your likings and skill level and get you hired fast.</p>
            <p>You can find and apply for jobs yourself with DriverFly or receive a personal concierge through Custom Trucker Recruiting. You can even receive even
              more support as a VIP member. Check if you qualify and get started on your path to finding your dream job!</p>
            < SocilShare />
          </div>
        </div>
      </div>
    </>
  )
}

TipsBlog.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      {page}
    </PublicLayout>
  )
}
