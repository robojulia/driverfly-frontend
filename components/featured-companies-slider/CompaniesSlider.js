import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CompanyApi from '../../pages/api/company';
import { useEffect, useState } from 'react'


export default function CompaniesSlider() {
    const api = new CompanyApi();
    const [ companies, setCompanies] = useState([]);

    const fetchCompanies = () => {

        const headers = {
        };

       api.employerList()
            .then(data => {
                console.log("handle success", data)
                setCompanies(data)
            })
            .catch(function (error) {
                console.log("handle error success", error.response)
            })
    }

    useEffect(() => {
        fetchCompanies()
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
                <div style={{ margin: " 10px" }}><div className="card  featured-companies">
                    <img style={{ height: '200px' }} src="img/CAMBRIDGE-TRANSPORT-truck-1.jpeg" className="card-img-top" alt="..." />
                    <div className="card-body text-center">
                        <span  className='my-3 card-title'>Cambridge Transport </span>
                        <i className="bi bi-star-fill" style={{ color: "Yellow" }}></i>
                        <br/>
                        <a href="#" className="btn btn-sm btn-primary my-3">1 Open Job</a>
                    </div>
                </div></div>
                <div style={{ margin: "10px" }}><div className="card  featured-companies">
                    <img style={{ height: '200px' }} src="img/Everett-Madison-Truck-1.jpg" className="card-img-top" alt="..." />
                    <div className="card-body text-center">
                        <span className='my-3 card-title'>Everett Madison Truck </span>
                        <i className="bi bi-star-fill" style={{ color: "Yellow" }}></i>
                        <br/>
                        <a href="#" className="btn btn-sm btn-primary my-3">1 Open Job</a>
                    </div>
                </div></div>
                <div style={{ margin: "10px" }}><div className="card  featured-companies">
                    <img style={{ height: '200px' }} src="img/Froggy-Logistics.jpg" className="card-img-top" alt="..." />
                    <div className="card-body text-center">
                        <span  className='my-3 card-title'>Froggy Logistics </span>
                        <i className="bi bi-star-fill" style={{ color: "Yellow" }}></i>
                        <br/>
                        <a href="#" className="btn btn-sm btn-primary my-3">1 Open Job</a>
                    </div>
                </div></div>
                <div style={{ margin: " 10px" }} ><div className="card  featured-companies">
                    <img style={{ height: '200px' }} src="img/CTR-logo-cartoon (1).png" className="card-img-top" alt="..." />
                    <div className="card-body text-center">
                        <span  className='my-3 card-title'> Customer Truck Recruiting </span>
                        <i className="bi bi-star-fill" style={{ color: "Yellow" }}></i>
                        <br/>
                        <a href="#" className="btn btn-sm btn-primary my-3">1 Open Job</a>
                    </div>
                </div></div>
            </Carousel>

        </div>
    )
}
