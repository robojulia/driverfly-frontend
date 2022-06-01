import React from 'react'
import { ArrowRight } from 'react-bootstrap-icons'

export default function NewsletterSingup() {
    return (
        <>
            <div className='d-flex flex-column align-items-center justify-content-center'>
                <h1 className='general-headings text-white mt-3'>NEWSLETTER SIGN UP</h1>
                <p>Subscribe to Driver Hiring Pacific newsletter to get the latest jobs posted,<br /> candidates ,and other latest news stay updated.​</p>
                <div className="input-group my-3 w-50" >
                    <div className="input-group input-group-lg">
                        <input type="text" className="form-control" placeholder='Enter Your Email' />
                        <span className="input-group-text" id="inputGroup-sizing-lg"
                            style={{ backgroundColor: "#2EC8C4", borderColor: "#2EC8C4" }}>
                            <ArrowRight color='#fff' />
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
