import Link from "next/link";
import { Facebook, Instagram } from 'react-bootstrap-icons';

export default function FollowUs

    () {
    return (
        <>
            <div className="col-md-10 d-flex justify-content-lg-end
justify-content-md-end justify-content-center  ">
                <div className="footer-social-icons">
                    <h6>Follow Us</h6>
                    <div className="social">
                        <Link href="https://www.facebook.com/DriverFlyJobs/">
                            <a target="_blank">
                                < Facebook />
                            </a>
                        </Link>

                    </div>
                    <div className="social">
                        <Link href="https://www.instagram.com/driver_hiring/">
                            <a target="_blank">
                                < Instagram />
                            </a>
                        </Link>

                    </div>
                </div>

            </div>

        </>
    )
}