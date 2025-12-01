import FollowUs from "./follow-us";
import ForDrivers from "./for-drivers";
import ForEmployers from "./for-employers";
import QuickLinks from "./quick-links";
import Logo from "./logo";
import CopyRight from "./copy-right";


export default function Footer() {
    return (
        <>
            <footer className="footer" id="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            < Logo />
                            < FollowUs />
                        </div>
                    </div>
                </div>
                <div className="footer-FollowUs mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg">
                                <QuickLinks />
                            </div>
                            <div className="col-lg col-12">
                                <ForEmployers />
                            </div>
                            <div className="col-lg col-12">
                                <ForDrivers />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="copyright-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            < CopyRight />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}