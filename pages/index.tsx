import Head from 'next/head';
import { PublicLayout } from '../components/layouts/public-layout';
import Featured from '../components/jobs/featured';
import Recent from '../components/jobs/recent';
import Drivers from '../components/works/drivers';
import Companies from '../components/works/companies';
import CompaniesSlider from '../components/featured-companies-slider/companies-slider';
import TestimonialSlider from '../components/testominial-slider/slider';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/use-translation';
import { useRouter } from 'next/router';
import NewsletterSingup from '../components/news-letter-signup';
import HeroSection from '../components/home/hero-section';
import MotorCarrier from '../components/home/motor-carrier';
import OwnerOperators from '../components/home/owner-operators';
import { Check } from 'react-bootstrap-icons';
import { EnvDebug } from '../components/debug/env-debug';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: Function;
  }
}
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();

  const [showTab, setShowTab] = useState('feature');

  useEffect(() => {
    // Add Google Tag Manager script dynamically
    const handleRouteChange = (url) => {
      window.gtag('config', 'G-9BHS96Z9P0', {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    console.log('welcome to driverfly');
  }, []);

  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="m9bfVuOGxtYDxi8eKLetXlJplLbdwnewUO37wDyw96I"
        />
        {/* Google Tag Manager script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9BHS96Z9P0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-9BHS96Z9P0');
                        `,
          }}
        ></script>
      </Head>
      <HeroSection />
      <MotorCarrier />
      <section className="hire-driver-bg">
        <div className="hire-driver-section container d-flex justify-content-center ">
          <div className="hire-driver-item hire-driver-left d-flex flex-column justify-content-start ">
            <div className="mt-5">
              <h3 style={{ marginBottom: '1.5rem' }}>Find Jobs</h3>
              <p style={{ marginBottom: '1.5rem' }}>{t('IT_COULD_NOT_BETTER_TIME')}</p>
              <div style={{ lineHeight: '1.5', marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.75rem' }}>
                  <Check />
                  {t('TOP_PAYING_JOBS')}
                </p>
                <p style={{ marginBottom: '0.75rem' }}>
                  <Check />
                  {t('HOME_BEST_TIME')}
                </p>
                <p style={{ marginBottom: '0' }}>
                  <Check />
                  {t('FASTER_&_EASIER_HIRING')}
                </p>
              </div>
            </div>
            <div className="gap-2  hire-driver-left-btns" style={{ marginBottom: '2rem' }}>
              <button
                className="theme-bg-btn-light-green"
                type="button"
                onClick={() => router.push('signup')}
              >
                {t('SIGN_UP')}
              </button>
              <button
                className="ocean-dark-bg-btn mx-3"
                type="button"
                onClick={() => router.push('find-jobs')}
              >
                Browse All Jobs
              </button>
            </div>
          </div>
          <div className="hire-driver-item hire-driver-right d-flex flex-column justify-content-start align-items-center ">
            <div className="mt-5" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Owner Operators</h3>
              <p style={{ margin: '0' }}>{t('ARE_YOU_LOOKING_LEASE_ONTO_NOTOR_CARRIER')}</p>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <button
                className="theme-bg-btn-light-green"
                type="button"
                onClick={() => router.push('find-jobs')}
              >
                {t('BROWSE_JOBS')}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="driver-sec">
        <div className="container how-it-work-sec">
          <Drivers />
        </div>
      </section>
      <section className="register-today-section">
        <div className="d-lg-flex signup-driver-section d-md-block">
          <div className="signup-driver-item signup-driver-left d-flex flex-column justify-content-center text-center">
            <h2 style={{ color: 'white' }}>{t('Getting a driver job has never been easier!')}</h2>
            <p style={{ color: 'white' }}>Apply Online And Let Us Match You. Create your free account in just minutes to be featured in front of hundreds of motor carriers.</p>
            <div>
              <button
                className="ocean-dark-bg-btn mt-3"
                type="button"
                onClick={() => router.push('https://app.driverfly.co/apply/driverfly')}
              >
                {t('REGISTER_TODAY')}
              </button>
            </div>
          </div>
          <div className="signup-driver-item signup-driver-right d-flex flex-column justify-content-around"></div>
        </div>
        <div className="signup-driver-section-border-bottom"></div>
      </section>
      <section className="tab-sec">
        <ul className="nav nav-tabs">
          <li className="nav-item" key="feature">
            <a
              href="#profile"
              className={`nav-link ${showTab != 'feature' ? 'active' : ''}`}
              data-toggle="tab"
              onClick={() => {
                setShowTab('feature');
              }}
            >
              {t('FEATURED_JOBS')}
            </a>
          </li>
          <li className="nav-item" key="recent">
            <a
              href="#profile"
              className={`nav-link ${showTab != 'recent' ? 'active' : ''}`}
              data-toggle="tab"
              onClick={() => {
                setShowTab('recent');
              }}
            >
              {t('RECENT_JOBS')}
            </a>
          </li>
        </ul>
        {showTab == 'feature' ? <Featured /> : <Recent />}
      </section>
      {/* < OwnerOperators /> */}
      {/* <CompaniesSlider /> */}
      <section>
        <div className="testimonial-sec home-testominial">
          <div className="container home-testominial">
            <h2 className="text-center">{t('WHAT_DRIVERS_SAY_ABOUT_US')}</h2>
            <div className="custom-tst pb-5">
              <div className="row owl-carousel owl-theme d-block" id="owl-demo">
                <TestimonialSlider />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="news-letter-signup-sec">
        <div className="container">
          <NewsletterSingup />
        </div>
      </section>
      <EnvDebug enabled={true} />
    </>
  );
}

Index.getLayout = function getLayout(page) {
  return <PublicLayout title="HOME">{page}</PublicLayout>;
};
