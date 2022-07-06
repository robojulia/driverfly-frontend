import React from 'react'
import Link from "next/link";
import { Facebook, Twitter, Instagram, People, Eye, FilePost } from 'react-bootstrap-icons'
import { useTranslation } from '../../hooks/useTranslation';

export default function CompanyInfo({ company, jobCount }) {
    const { t } = useTranslation();
    const regex = `([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)`
    const validAbout = !!!(company.about?.match(regex))

    return (
        <div className='my-4'>
            <div className='row'>
                <div className='col-md-8 col-sm-12 col-lg-8'>
                    <div className='social-profile-sec'>
                        <h6>{t('SOCIAL_PROFILE')}:</h6>
                        <div className="hvr-float-shadow mx-2 ">
                            {/* <Link href=""> */}
                            <a target="_blank">
                                < Facebook color=' #b6b6b6' size={25} />
                            </a>
                            {/* </Link> */}
                        </div>
                        <div className="hvr-float-shadow mx-2">
                            {/* <Link href=""> */}
                            <a target="_blank">
                                < Twitter color=' #b6b6b6' size={25} />
                            </a>
                            {/* </Link> */}
                        </div>
                        <div className="hvr-float-shadow mx-2">
                            {/* <Link href=""> */}
                            <a target="_blank">
                                < Instagram color=' #b6b6b6' size={25} />
                            </a>
                            {/* </Link> */}
                        </div>
                    </div>
                    <div className='my-3'>
                        {
                            validAbout && company.about
                        }
                    </div>
                </div>
                <div className='col-md-4 col-lg-4 col-sm-12'>
                    <h1 className='display-5 fs-4  fw-light lh-lg'> {t('EMPLOYER_LOCATION')}</h1>
                    <h1 className='display-5 fs-4  fw-light lh-lg'> {t('COMPANY_INFORMATION')}</h1>
                    <div style={{
                        backgroundColor: '#fafafa',
                        padding: '25px'
                    }}>
                        {/* <div className='d-flex align-items-center mb-3'>
                            <div className='mr-2'>
                                <People color='#2da2af' size={30} />
                            </div>
                            <div className='lh-base'>
                                <p className='mb-0'>{t('TEAM_SIZE')}</p>
                                <small className='text-muted'>1-50 Members</small>
                            </div>
                        </div> */}
                        {/* <div className='d-flex align-items-center mb-3'>
                            <div className='mr-2'>
                                <Eye color='#2da2af' size={30} />
                            </div>
                            <div>
                                <p className='mb-0'>{t('VIEWS')}</p>
                                <small className='text-muted'>182</small>
                            </div>
                        </div> */}
                        <div className='d-flex align-items-center mb-3' >
                            <div className='mr-2'>
                                <FilePost color='#2da2af' size={30} />
                            </div>
                            <div>
                                <p className='mb-0'>{t('POSTED_JOBS')}</p>
                                <small className='text-muted'>{jobCount || 0}</small>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
