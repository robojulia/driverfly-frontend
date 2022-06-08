import React from 'react'
import Link from "next/link";
import { Facebook, Twitter, Instagram, People,Eye,FilePost } from 'react-bootstrap-icons'

export default function CompanyInfo() {
    return (
        <div className='my-4'>
            <div className='row'>
                <div className='col-md-8 col-sm-12 col-lg-8'>
                    <div className='social-profile-sec'>
                        <h6>Socail Profile:</h6>
                        <div className="hvr-float-shadow mx-2 ">
                            <Link href="https://www.facebook.com/DriverFlyJobs/">
                                <a target="_blank">
                                    < Facebook color=' #b6b6b6' size={25} />
                                </a>
                            </Link>

                        </div>
                        <div className="hvr-float-shadow mx-2">
                            <Link href="">
                                <a target="_blank">
                                    < Twitter color=' #b6b6b6' size={25} />
                                </a>
                            </Link>

                        </div>
                        <div className="hvr-float-shadow mx-2">
                            <Link href="https://www.instagram.com/driver_hiring/">
                                <a target="_blank">
                                    < Instagram color=' #b6b6b6' size={25} />
                                </a>
                            </Link>

                        </div>
                    </div>
                    <div className='my-3'>
                        <img src='../../img/wilds_logo_250.png' />
                    </div>
                </div>
                <div className='col-md-4 col-lg-4 col-sm-12'>
                    <h1 className='display-5 fs-4  fw-light lh-lg'> Employer Location</h1>
                    <h1 className='display-5 fs-4  fw-light lh-lg'> Company Information</h1>
                    <div style={{
                        backgroundColor: '#fafafa',
                        padding: '25px'
                    }}>
                        <div className='d-flex align-items-center mb-3'>
                            <div className='mr-2'>
                                <People  color='#2da2af' size={30}/>
                            </div>
                            <div className='lh-base'>
                                <p className='mb-0'>Team Size</p>
                                <small className='text-muted'>1-50 Members</small>
                            </div>

                        </div>
                        <div className='d-flex align-items-center mb-3'>
                            <div className='mr-2'>
                                <Eye  color='#2da2af'  size={30}/>
                            </div>
                            <div>
                                <p className='mb-0'>Views</p>
                                <small className='text-muted'>182</small>
                            </div>

                        </div>
                        <div className='d-flex align-items-center mb-3' >
                            <div className='mr-2'>
                                <FilePost  color='#2da2af'  size={30}/>
                            </div>
                            <div>
                                <p className='mb-0'>Posted jobs</p>
                                <small className='text-muted'>1</small>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
