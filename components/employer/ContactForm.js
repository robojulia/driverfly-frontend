import React from 'react'

export default function ContactForm() {
    return (
        <div>
            <div
                style={{
                    backgroundColor: '#fafafa;',
                    padding: '20px'
                }}>
                <form>
                    <div className="my-4">
                        <input type="text" className="form-control shadow-sm" placeholder='Subject' />
                    </div>
                    <div className="my-4">
                        <input type="email" className="form-control shadow-sm" placeholder='E-mail' />
                    </div>
                    <div className="my-4">
                        <input type="tel" className="form-control shadow-sm" placeholder='Phone' />
                    </div>
                    <div className="input-group">
                        <textarea className="form-control shadow-sm" placeholder='Message'></textarea>
                    </div>
                    <button type="button" className="custom-trucker-follow-btn mt-3">
                        Submit Review</button>
                </form>
            </div>

        </div>
    )
}
