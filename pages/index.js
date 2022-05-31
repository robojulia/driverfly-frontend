import Head from "next/head";
import Layout from "../components/layouts";
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
import { Arrow90degDown, Search } from "react-bootstrap-icons";
import NewsletterSingup from "../components/newsletter-signup/NewsletterSingup";
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();

  const [showRecent, setShowRecent] = useState(true);
  function updateState() {
    setShowRecent(!showRecent);
  }

  const [filters, setFilters] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    router.push({
      pathname: "find-jobs",
      query: { ...filters },
    });
  };

  const searchHandler = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

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
                <h2>
                  Choose from thousands of CDL and Non-CDL truck driving jobs.
                  Get hired fast. Start Searching.
                </h2>
              </div>

              <div className="hero-search">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <Search className="home_search" />
                  </div>
                  <input
                    onKeyPress={searchHandler}
                    onChange={handleChange}
                    name="keywords"
                    type="text"
                    className=""
                    placeholder="Job Title or Keywords"
                    aria-label=""
                    aria-describedby="basic-addon1"
                  />
                </div>
                <select
                  name="employment_type"
                  onChange={handleChange}
                  className="form-select custom-sel"
                  aria-label="Default select example"
                  id="exampleFormControlSelect1"
                >
                  <option className="selectbg">All Types</option>
                  {Object.keys(JobEmploymentType).map((key, index) => {
                    return (
                      <option key={index} value={key}>
                        {t(JobEmploymentType[key].toLowerCase())}
                      </option>
                    );
                  })}
                </select>
                <select
                  name="cdl_class"
                  onChange={handleChange}
                  className="form-select custom-sel "
                  aria-label="Default select example"
                  id="exampleFormControlSelect1"
                >
                  <option>All Categories</option>
                  {Object.keys(DriverLicenseType).map((key, index) => {
                    return (
                      <option key={index} value={key}>
                        {t(DriverLicenseType[key].toLowerCase())}
                      </option>
                    );
                  })}
                </select>
                <div className="form-group form-group-search m-0">
                  <button
                    className="btn-submit btn btn-block btn-theme hvr-shrink"
                    type="button"
                  >
                    Search
                  </button>
                </div>
              </div>
              <TrendingWords />
            </div>
          </div>
        </div>
      </section>
      <section className="hire-driver-bg">
        <div className="container d-flex justify-content-center hire-driver-section
       ">
          <div className="hire-driver-item hire-driver-left d-flex flex-column justify-content-around">
            <h1>Hire A Driver</h1>
            <p>
              Get exposed to qualified drivers throughout the United States.{" "}
            </p>
            <div>
              <button className="theme-bg-btn" type="button">
                post a job
              </button>
            </div>
          </div>
          <div className="hire-driver-item hire-driver-right d-flex flex-column justify-content-around">
            <h1>Find A job</h1>
            <p>
              Search from hundreds of available CDL and non-CDL driver jobs
              across the US.
            </p>
            <div>
              <button className="white-bg-btn" type="button">
                browse jobs
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="opacity-overly">
        <section className="owner-operator-bg">
          <div className="container text-center">
            <h1 className="owner-operator-title">Owner opertors</h1>
            <p className="owner-operatot-text">
              Are you looking to lease on to a Motor Carrier? We’ve got
              opportunities for you too! Go to the job search and select owner
              operator for job type.
            </p>
            <button className=" white-bg-btn ">Lease on to a carriers</button>
          </div>
        </section>
      </div>

      <section className="tab-sec">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              href="#home"
              className="nav-link active"
              data-toggle="tab"
              onClick={updateState}
            >
              Featured Jobs
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#profile"
              className="nav-link"
              data-toggle="tab"
              onClick={updateState}
            >
              Recent Jobs{" "}
            </a>
          </li>
        </ul>
        {
          showRecent ? < Featured />
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
            <button className="theme-bg-btn ">Create an Account</button>
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
    <Layout>
      {page}
    </Layout>
  )

};
