import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CompanyApi from '../../pages/api/company';
import { useEffect, useState } from 'react'
import CompanyPhoto from "../jobs/company-photo"


export default function CompaniesSlider() {
    const companyApi = new CompanyApi();
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        await companyApi.employer.list({ take: 3 })
            .then(data => setCompanies(data))
            .catch(function (error) {
                console.log("handle error success", error.response)
            })
    }

    const fetchCompanyCount = async (companyId) => {
        return await companyApi.employer.getJobCount(companyId)
            .then(data => (data))
            .catch(function (error) {
                console.log("handle error success", error.response)
            })
    }


    useEffect(async () => {
        await fetchCompanies()
    }, []);

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <div className='my-3'>
            <h3 className='my-3 text-center general-headings'>Featured Companies</h3>
            <Carousel responsive={responsive}
                swipeable={false}
                draggable={false}
                showDots={true}
                arrows={false}
                autoPlay={false}
                infinite={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                itemClass="carousel-item-padding-40-px">
                {companies.length > 0 && companies.map(company => (
                    <>
                        <div style={{ margin: " 10px" }}>
                            <div className="card  featured-companies">
                                <CompanyPhoto className="card-img-top" style={{ height: '200px' }} company={company} />
                                <div className="card-body text-center">
                                    <span className='my-3 card-title'>{company.name}</span>
                                    <i className="bi bi-star-fill" style={{ color: "Yellow" }}></i>
                                    <br />
                                    <a href="#" className="btn btn-sm btn-primary my-3">{fetchCompanyCount(company.id)}Job</a>
                                </div>
                            </div>
                        </div>
                    </>
                ))}
            </Carousel>

        </div>
    )
}
