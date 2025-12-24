import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CompanyApi from '../../pages/api/company';
import { useEffect, useState, useMemo, useCallback } from 'react'
import CompanyPhoto from "../jobs/company-photo"
import CompanyJobsCount from '../employer/company-jobs-count';
import { useTranslation } from '../../hooks/use-translation';


import Link from "next/link";


export default function CompaniesSlider() {

    const { t } = useTranslation();
    const companyApi = useMemo(() => new CompanyApi(), []);
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = useCallback(async () => {
        await companyApi.employer.list({ take: 6 })
            .then(data => setCompanies(data))
            .catch(function (error) {
                console.log("handle error success", error.response)
            })
    }, [companyApi])

    useEffect(() => {
        fetchCompanies()
    }, [fetchCompanies]);

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
        <section className="container mb-5 company_slider">
            <div className='my-3'>
                <h3 className='my-3 text-center general-headings'>{t("FEATURED_COMPANIES")}</h3>
                <Carousel responsive={responsive}
                    swipeable={false}
                    draggable={false}
                    showDots={true}
                    arrows={false}
                    autoPlay={true}
                    infinite={true}
                    autoPlaySpeed={1000}
                    keyBoardControl={true}
                    itemClass="carousel-item-padding-40-px">
                    {companies.length > 0 && companies.map(company => (
                        <>
                            <Link href={`/employer/${company.id}`}>
                                <a>
                                    <div style={{ margin: " 10px" }}>
                                        <div className="card  featured-companies">
                                            <CompanyPhoto className="card-img-top" style={{ height: '200px' }} company={company} />
                                            <div className="card-body text-center">
                                                <span className='my-3 card-title'>{company.name}</span>
                                                <br />
                                                <CompanyJobsCount companyId={company.id} label={`${t("JOBS")}`} className="btn btn-sm btn-primary my-3" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </>
                    ))}
                </Carousel>

            </div>
        </section>
    )
}
