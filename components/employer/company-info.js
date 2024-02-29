import React from 'react'
import { Facebook, Twitter, Instagram, FilePost, Linkedin } from 'react-bootstrap-icons'
import { useTranslation } from '../../hooks/use-translation';
import Link from "next/link";

export default function CompanyInfo({ company, jobCount, terminals }) {
    const { t } = useTranslation();
    console.log("Terminals : ",terminals);
    return (
        <div className='col-md-4 col-lg-4 col-sm-12 px-5'>
            <div className='py-4'>
                <p style={{ fontSize: "22px", fontWeight: 'lighter' }}>{t("WEBSITE_")}</p>
                <Link href={company?.website} className='text-danger' style={{ textDecoration: 'none', color: 'text-secondary' }}>{company?.website}</Link>
            </div>
            <div className='py-4'>
                <p style={{ fontSize: "22px", fontWeight: 'lighter' }}>{t("HEADQUATERS")}</p>
                <p style={{ fontSize: "15px", fontWeight: '400' }}>123 Happy Lane, Dallas, TX 70025</p>
            </div>
            <div className='py-4'>
                <p style={{ fontSize: "22px", fontWeight: '200' }}>{t("TERMINALS")}</p>
            {
                terminals?.map(location =>{
                    <>
                    <p style={{ fontSize: "15px", fontWeight: '400' }}>{location}</p>
                    </>
                })
            }
            </div>
           

            {/* <h1 className='display-5 fs-4  fw-light lh-lg'> {t('EMPLOYER_LOCATION')}</h1>
                    <h1 className='display-5 fs-4  fw-light lh-lg'> {t('COMPANY_INFORMATION')}</h1>
                    <div style={{
                        backgroundColor: '#fafafa',
                        padding: '5px'
                    }}>
                        <div className='d-flex align-items-center mb-3' >
                            <div className='mr-2'>
                                <FilePost color='#2da2af' size={30} />
                            </div>
                            <div>
                                <p className='mb-0'>{t('POSTED_JOBS')}</p>
                                <small className='text-muted'>{jobCount || 0}</small>
                            </div>

                        </div>

                    </div> */}
        </div>
    )
}
