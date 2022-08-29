import Head from "next/head";
import { PublicLayout } from "../components/layouts/PublicLayout";
import Featured from "../components/jobs/Featured";
import Recent from "../components/jobs/Recent";
import Drivers from "../components/works/drivers";
import Companies from "../components/works/companies";
import CompaniesSlider from '../components/featured-companies-slider/CompaniesSlider'
import HomeSearch from "../components/megasearch/search";
import Slider from "../components/testominial-slider/Slider";
import Pric from "../public/css/Pricing.module.css";
import React, { useState, useEffect } from "react";
import TrendingWords from "../components/trending-words/Trending";
import { useTranslation } from "../hooks/useTranslation";
import { DriverLicenseType } from "../enums/users/driver-license-type.enum";
import { JobEmploymentType } from "../enums/jobs/job-employment-type.enum";
import { useRouter } from "next/router";
import { GeoAlt, Search } from "react-bootstrap-icons";
import NewsletterSingup from "../components/newsletter-signup/NewsletterSingup";
import HeroSearch from "../components/home/hero-search";
import { features } from "process";
export default function Index() {

    const router = useRouter();
    const { t } = useTranslation();

    const [showTab, setShowTab] = useState('recent');

    // const handleFeatureRecentClick = () => {
    //     setShowTab()
    // }
    return (
        <>
        <Head>
        <meta name="google-site-verification" content="u9pObpXZdj9Sg1OAcmNROgOKsntKHQXyejNI2XP0y44" />
        </Head>
            <section className="hero-sec">
                <div className="container ">
                    <div className="row mt-5">
                        <div className="col-md-12">
                            <div className="hero-inner">
                                <h1>Find The Job That Fits Your Life</h1>
                                <h2>
                                    Choose from thousands of CDL and Non-CDL truck driving jobs.
                                    Get hired fast. Start Searching.
                                </h2>
                            </div>
                            <HeroSearch />
                            <TrendingWords />
                        </div>
                    </div>
                </div>
            </section>
            <section className="hire-driver-bg">
                <div className="container d-flex justify-content-center hire-driver-section
       ">
                    <div className="hire-driver-item hire-driver-left d-flex flex-column justify-content-around">
                        <h1>Hire a Driver</h1>
                        <p>
                            Get exposed to qualified drivers throughout the United States.{" "}
                        </p>
                        <div>
                            <button className="theme-bg-btn" type="button" onClick={() => router.push("signup")}>
                                Post a Job
                            </button>
                        </div>
                    </div>
                    <div className="hire-driver-item hire-driver-right d-flex flex-column justify-content-around">
                        <h1>Find a Job</h1>
                        <p>
                            Search from hundreds of available CDL and non-CDL driver jobs
                            across the US.
                        </p>
                        <div>
                            <button className="white-bg-btn" type="button" onClick={() => router.push("find-jobs")}>
                                Browse Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <div className="opacity-overly">
                <section className="owner-operator-bg">
                    <div className="container text-center">
                        <h1 className="owner-operator-title">Owner Operators</h1>
                        <p className="owner-operatot-text">
                            Are you looking to lease onto a motor carrier? We have
                            opportunities for you too! Go to the job search page and select owner
                            operator for employment type.
                        </p>
                        <button
                            className="white-bg-btn"
                            onClick={() => router.push({ pathname: 'find-jobs', query: { "employment_type": 'OWNER_OPERATOR' } })}>
                            Lease onto a Carrier
                        </button>
                    </div>
                </section>
            </div>

            <section className="tab-sec">
                <ul className="nav nav-tabs">
                   
                    <li className="nav-item" key="recent">
                        <a
                            href="#profile"
                            className={`nav-link ${showTab !== 'recent'? 'active' : '' }`}
                            data-toggle="tab"
                            onClick={ () =>{
                                setShowTab('recent')
                            }}
                        >
                            Recent Jobs{" "}
                        </a>
                    </li>
                    <li className="nav-item" key="feature">
                        <a
                            href="#profile"
                            className={`nav-link ${showTab !== 'feature'? 'active' : '' }`}
                            data-toggle="tab"
                            onClick={ () =>{
                                setShowTab('feature')
                            }}
                        >
                            Featured Jobs
                        </a>
                    </li>
                </ul>
                {
                    showTab === 'feature' ? < Featured />
                        :
                        < Recent />
                }
            </section>
            <section className="container">
                <CompaniesSlider />
            </section>
            <section className="driver-sec">
                <div className="container how-it-work-sec">
                    <Drivers />
                    <Companies />
                </div>
            </section>
            <div className="opacity-overly">
                <section className="get-feature-section">
                    <div className="container text-center">
                        <h1>POST A RESUME & GET FEATURED</h1>
                        <p>
                            Create your free account in just minutes to be featured in front of hundreds of motor carriers.
                        </p>
                        <button className="theme-bg-btn " onClick={() => router.push("signup")}>Create an Account</button>
                    </div>
                </section>
            </div>
            <div className="testimonial-sec home-testominial">
                <div className="container">
                    <h2 className="text-center">What Drivers Say About Us</h2>
                    <div className="custom-tst pb-5">
                        <div className="row owl-carousel owl-theme d-block" id="owl-demo">
                            <Slider />
                        </div>
                    </div>
                </div>
            </div>
            <section className="news-letter-signup-sec">
                <div className="container">
                    <NewsletterSingup />
                </div>

            </section>
        </>
    );
}

Index.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="HOME">
            {page}
        </PublicLayout>
    )

};
