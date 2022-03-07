import Head from 'next/head';
import Layout from "../components/layouts";
import Featured from '../components/jobs/Featured'
import Recent from '../components/jobs/Recent'
import Drivers from '../components/works/drivers'
import Companies from '../components/works/companies'
import HomeSearch from '../components/megasearch/search'
import Slider from '../components/testominial-slider/Slider'
import Pric from '../public/css/Pricing.module.css'
import React, { useState } from 'react';
import TrendingWords from '../components/trending-words/Trending';

export default function Index() {

    const [showRecent, setShowRecent] = useState(true);
    function updateState() {
        setShowRecent(!showRecent);
    }
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
                                <h2>Choose from thousands of CDL and Non-CDL truck driving jobs. Get hired fast. Start Searching.</h2>
                            </div>
                           
                            <div className="hero-search">

                                <div className="input-group w-25">
                                    <div className="input-group-prepend">
                                        <i className="fa fa-search" aria-hidden="true"></i>
                                    </div>
                                    <input type="text" className="" placeholder="Job Title or Keywords" aria-label="" aria-describedby="basic-addon1" />
                                </div>
                                <form action="">
                                    <div className="filter-inner d-flex align-items-center pl-3">
                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        <input type="text" className="form-control border-0" placeholder="Location" />
                                        <span className="find-me"></span>
                                    </div>
                                </form>

                                <select className=" form-control  form-select custom-sel" aria-label="Default select example" id="exampleFormControlSelect1">
                                    <option className='selectbg'
                                    >All Types</option>

                                    <option className='selectbg'>Solo (27)</option>
                                    <option className='selectbg'>Team Drivers(4)</option>
                                </select>

                                <select className="form-select custom-sel border-0" aria-label="Default select example" id="exampleFormControlSelect1">
                                    <option>All Categories</option>
                                    <option> Class A CDL(30)</option>
                                </select>
                                <div className="form-group form-group-search m-0">
                                    <button className="btn-submit btn btn-block btn-theme" type="submit">Search</button>
                                </div>
                            </div>
                            <TrendingWords />
                        </div>
                    </div>
                </div>
            </section>
            <section className="tab-sec">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#home" className="nav-link active" data-toggle="tab" onClick={updateState}>
                            Featured Jobs</a>
                    </li>
                    <li className="nav-item">
                        <a href="#profile" className="nav-link" data-toggle="tab" onClick={updateState}>
                            Recent Jobs </a>
                    </li>
                </ul>
                {
                    showRecent ? < Featured />
                        :
                        < Recent />
                }
                
            </section>
            <section className="driver-sec">
                <div className="container how-it-work-sec">
                    <Drivers />
                    <Companies />
                </div>
            </section>
            <div className="testimonial-sec home-testominial">
                <div className="container">
                    <h2 className="text-center">What Drivers Say About Us</h2>
                    <div className="custom-tst pb-5">
                        <div className="row owl-carousel owl-theme d-block" id="owl-demo">
                            < Slider />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

Index.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}