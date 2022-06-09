import React from 'react'
import { StarFill } from 'react-bootstrap-icons'

export default function ReviewForm() {
    return (
        <div className='my-3'>
            <h1 className='custom-trucker-title'>Be the first to review “Custom Trucker Recruiting”</h1>
            <div style={{
                backgroundColor: '#f1f1f1',
                padding: '50px'
            }}>
                <form>
                    <div>
                        <h1 className='display-5 fs-4 text-center fw-light lh-sm'>
                            Your Rating for this listing
                        </h1>
                        <div className='text-center'>
                            <StarFill color='#febe42' className='mx-1' size={20} />
                            <StarFill color='#febe42' className='mx-1' size={20} />
                            <StarFill color='#febe42' className='mx-1' size={20} />
                            <StarFill color='#febe42' className='mx-1' size={20} />
                            <StarFill color='#febe42' className='mx-1' size={20} />
                        </div>
                    </div>

                    <div className="form-group my-2">
                        <label htmlFor="exampleFormControlInput1">Name</label>
                        <input type="text" className="form-control  " id="exampleFormControlInput1" placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Email address</label>
                        <input type="email" className="form-control  " id="exampleFormControlInput1" placeholder="your@mail.com" />
                    </div>
                    <div className="form-check my-2">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDisabled" />
                        <label className="form-check-label" htmlFor="flexCheckDisabled">
                            Save my name, email, and website in this browser for the next time I comment.
                        </label>
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="exampleFormControlTextarea1">Review</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="2" placeholder="Write Comment"></textarea>
                    </div>
                    <button type="button" className="custom-trucker-follow-btn mt-2">
                        Submit Review</button>
                </form>
            </div>
        </div>
    )
}
