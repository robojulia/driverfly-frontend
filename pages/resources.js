import React, { useState, useEffect } from 'react'
import Head from "next/head";
import Layout from "../components/layouts";
import resource from '../public/css/Resources.module.css'

export default function Resources()
{
    const types = [
        {
            type: "All",
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            type: "TMS",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Factoring",
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            type: "Safety & Compliance",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Equipment Leasing",
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            type: "Dispatch",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Integrator",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Fuel Cards / Payroll Processor",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Short Haul Fleets",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Load Board",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Insurance Technology",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            type: "Driver Payments",
            for_drivers: false,
            for_oo: true,
            for_companies: true
        },
        {
            type: "Job Board",
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            type: "Driver App",
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            type: "Connected Vehicle API",
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
    ]

    const resources = [
        {
            company: "Zuum",
            type: "TMS",
            link: "https://www.atob.us/?utm_source=driverfly",
            description:
                `Optimize & streamline your business. Automate your freight and link ERP on one
                logistics super platform.`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "Love's Factoring",
            type: "Factoring",
            link: "https://www.loves.com/en/financial-services/freight-factoring?utm_source=driverfly",
            description:
                `Freight Factoring with Love’s Financial is a smart solution to manage your
                cash flow, and cover expenses like fuel, insurance, maintenance and payroll
                without creating debt for your business.`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "Elite Registration",
            type: "Safety & Compliance",
            link: "https://elite-registration-services.business.site/?utm_source=driverfly",
            description:
                `Compliance and Insurance Agency in Lynden, WA`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "Basic Block",
            type: "Factoring",
            link: "https://basicblock.io/?utm_source=driverfly",
            description:
                `BasicBlock is a cutting-edge freight factoring company trucking tool for carriers
                and owner operators to simplify and speed up payment for their truck loads.`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "Manifest Advance Funding",
            type: "Equipment Leasing",
            link: "https://www.linkedin.com/in/james-lerebours-9190441b/?utm_source=driverfly",
            description:
                `Manifest Advance Funding offers a one stop business financing.`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "LWD Logistics",
            type: "Dispatch",
            link: "https://lwdlogistics.com/?utm_source=driverfly",
            description:
                `LWD Logistics is a Freight Brokerage, Freight Forwarding and Global Transportation
                company providing an array of unique services.`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "Comfreight",
            type: "Factoring",
            link: "https://comfreight.com/?utm_source=driverfly",
            description:
                `Providers of the leading freight payment automation technology and a digital load
                board for freight matching and bidding to help you evolve digitally.`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "Chain.io",
            type: "Integrator",
            link: "https://chain.io/?utm_source=driverfly",
            description:
                `Seamlessly Connect Your Supply Chain Software with Advanced Integrations`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "AtoB",
            type: "Fuel Cards / Payroll Processor",
            link: "https://www.atob.us/?utm_source=driverfly",
            description:
                `A zero-fee fuel card accepted everywhere`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "Buffalo Market",
            type: "Short Haul Fleets",
            link: "",
            description:
                ``,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "DAT",
            type: "Load Board",
            link: "https://www.dat.com/load-boards?utm_source=driverfly",
            description:
                `Get the most relevant matches for your business – the right load for the right
                truck at the right price, no matter where you are.`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "Netradyne",
            type: "Insurance Technology",
            link: "https://www.netradyne.com/?utm_source=driverfly",
            description:
                `Our mission is to transform road and fleet safety by using advanced vision
                technology to change the way drivers interact with the road around them, therefore
                creating safer roadways for today and smarter roadways for tomorrow.`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        },
        {
            company: "RoadSync",
            type: "Driver Payments",
            link: "https://roadsync.com/?utm_source=driverfly",
            description:
                `RoadSync is designed for stress-free logistics payments. Drive your business
                forward with fast, easy digital solutions.`,
            for_drivers: false,
            for_oo: true,
            for_companies: true
        },
        {
            company: "CDL Life",
            type: "Job Board",
            link: "https://cdllife.com/trucking/?utm_source=driverfly",
            description:
                `We recognize the daily sacrifices of the men and women working tirelessly to
                provide for both our families and theirs. Our team is committed to providing
                industry news, opportunity, tools, and community for millions of drivers every day`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "Trucker Tools",
            type: "Driver App",
            link: "https://www.truckertools.com/?utm_source=driverfly",
            description:
                `Our Smart Capacity solution provides brokerages and 3PLs.`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "Koffie",
            type: "Insurance Technology",
            link: "https://getkoffie.com/?utm_source=driverfly",
            description:
                `Safety technology makes a difference. Koffie provides telematics devices and
                AI-enabled dashcams to your fleet, helping your drivers avoid accidents and
                coaching them to reduce risky behavior.`,
            for_drivers: true,
            for_oo: true,
            for_companies: true
        },
        {
            company: "Motorq",
            type: "Connected Vehicle API",
            link: "https://motorq.com/?utm_source=driverfly",
            description:
                `As the leading connected car API company, we unlock the power of vehicle data
                for fleets, dealers, and insurance companies. Our customers use insights from
                this data to run safer, more sustainable, higher-performing operations.`,
            for_drivers: false,
            for_oo: false,
            for_companies: true
        }
    ];

    const [audience, setAudience] = useState("all");
    const [resourceType, setResourceType] = useState("All");
    const [filteredResources, setFilteredResources] = useState([]);

    useEffect( () => {
        // filter for audience (drivers vs companies)
        let fr = resources.filter( v => {
            if (audience === "drivers") {
                return v.for_drivers;
            }
            if (audience === "companies") {
                return v.for_companies;
            }
            if (audience === "oo") {
                return v.for_oo;
            }
            return true;
        });

        // filter for resource type
        fr = fr.filter( v => {
            return (resourceType === "All" || resourceType === v.type);
        });

        setFilteredResources(fr);
    }, [audience, resourceType]);

    const handleChangeResourceType = event => {
        let type = event.target.name;
        setResourceType(type);
    };

    const handleChangeAudience = event => {
        let audience = event.target.value;
        setAudience(audience);
    };

    return (
        <>
            <Head>
                <title>Trucking Industry Resources</title>
            </Head>

            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Trucking Industry Resources</h2>
                        <ul className="d-flex">
                            <li><a href="index.html" className="nav-link text-dark px-0">Home <i className="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
                            <li><a href="#" className="nav-link text-dark px-0">Trucking Industry Resources</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container mt-5 mb-5 p-lg-2 p-0">
                <div className="resource-audience-filter-sec">
                    <label>
                        Audience Type:
                        <select className="m-2" value={audience} onChange={handleChangeAudience}>
                            <option value="all">All</option>
                            <option value="drivers">Drivers</option>
                            <option value="oo">Owner Operators</option>
                            <option value="companies">Companies</option>
                        </select>
                    </label>
                </div>
                <div className="resource-type-filter-sec">
                    <label>
                        Resource Type:
                        {
                            // only show types for the chosen audience type
                            types.map(function(obj, id) {
                                if (
                                    audience === "all" ||
                                    (audience === "drivers" && obj.for_drivers) ||
                                    (audience === "oo" && obj.for_oo) ||
                                    (audience === "companies" && obj.for_companies)
                                )
                                {
                                    return (
                                        <div className={resource.resource_type_button}>
                                            <button
                                                name={obj.type}
                                                onClick={handleChangeResourceType}
                                            >
                                                { obj.type }
                                            </button>
                                        </div>
                                    )
                                }
                            })
                        }
                    </label>
                </div>

                <div className="resource-list-sec">
                    {
                        filteredResources.map(function(obj, id) {
                            return (
                                <div>
                                    <h5> { obj.company } </h5>
                                    <p>
                                        { obj.description }
                                        <br />
                                        <a href={obj.link} target="_blank"> Learn more. </a>
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

Resources.getLayout = function getLayout(page) {
    return (
        <Layout>
        {page}
        </Layout>
    )
}
