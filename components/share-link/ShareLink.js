import {  Facebook, Linkedin, Pinterest, Plus, Twitter } from 'react-bootstrap-icons';

export default function SocilShare() {


    return (
        <>
            <div className="share-links">
                <span className="title mr-3">Share Link: </span>
                <div className="social-share">
                    < Facebook />
                    {/* <i className="fa fa-facebook" aria-hidden="true"></i> */}
                    < Twitter />
                    {/* <i className="fa fa-twitter" aria-hidden="true"></i> */}
                    < Linkedin />
                    {/* <i className="fa fa-linkedin" aria-hidden="true"></i> */}
                    < Pinterest />
                    {/* <i className="fa fa-pinterest-p" aria-hidden="true"></i> */}
                    {/* <i className="fa fa-plus" aria-hidden="true"></i> */}
                    < Plus />
                </div>
            </div>

        </>
    )
}