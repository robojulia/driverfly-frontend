import FollowUs from "./follow-us";
import Logo from "./logo";
import CopyRight from "./copy-right";


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