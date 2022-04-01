import Link from "next/link";
import FollowUs from "./Follow-Us";
import DriversNewsletter from "./Drivers-Newsletter";
import ForDrivers from "./For-Drivers";
import ForEmployers from "./For-Employers";
import QuickLinks from "./Quick-Links";
import Logo from "./Logo";
import CopyRight from "./Copy-Right";

export default function Footer() {
    return (
        <>
            <footer className="footer">
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
                            <div className="col-12 col-md-3 col-lg-3 col-sm-4">
                                <QuickLinks />
                            </div>
                            <div className="col-lg-2 col-12">
                                <ForEmployers />
                            </div>
                            <div className="col-lg-2 col-12">
                                <ForDrivers />
                            </div>
                            <div className="col-lg-5 pl-lg-5 p-2">
                                <DriversNewsletter />
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