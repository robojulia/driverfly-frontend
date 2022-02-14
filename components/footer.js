
export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2">
                                <img src="img/driverfly-logo-square.png" alt="" className="footer-logo"/>
                            </div>
                            <div className="col-md-10 d-flex justify-content-end">
                                <div className="footer-social-icons">
                                    <h6>Follow Us</h6>
                                    <div className="social">
                                        <i className="fa fa-facebook" aria-hidden="true"></i>
                                    </div>
                                    <div className="social">
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                    </div>
                                    <div className="social">
                                        <i className="fa fa-instagram" aria-hidden="true"></i>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="footer-inner">
                                    <h2 className="widget-title">Quick Links</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Login</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Driver Recruiting</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Featured Employers</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">FAQ</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">The DriverFly on the Wall Blog</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Contact</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="footer-inner">
                                    <h2 className="widget-title">For Employers</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Dashboard</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Create Job Posting</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Jobs</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Messages</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="footer-inner pl-4">
                                    <h2 className="widget-title">For Drivers</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Dashboard</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Search Jobs</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Resume</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Messages</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-5 pl-5">
                                <div className="footer-inner">
                                    <h2 className="widget-title">Drivers Newsletter</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Subscribe to the DriverFly Newsletter to get the latest
                                                jobs feeds.</a>
                                        </li>
                                        <form action="">
                                            <input type="email" className="form-control" placeholder="Email Adress"/>
                                            <button type="submit" className="btn btn-danger btn-lg btn-block mt-3">Submit</button>
                                        </form>
                                    </ul>
                                </div>
                                <div className="footer-inner">
                                    <h2 className="widget-title">
                                        Companies Newsletter</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Subscribe to the DriverFly Newsletter to get the
                                                latest <br/> discount codes & coupons, and major news headlines.</a>
                                        </li>
                                        <form action="">
                                            <input type="email" className="form-control" placeholder="Email Adress"/>
                                            <button type="submit" className="btn btn-danger btn-lg btn-block mt-3">Submit</button>
                                        </form>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="copyright-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="copy-text">© 2021 DriverFly. All Rights Reserved.</div>
                            <ul id="menu-copyright" className="menu d-flex align-items-center">
                                <li id="menu-item-4034" className="menu-item mr-4"><a href="#">Site Map</a></li>
                                <li id="menu-item-4033" className="menu-item"><a href="#">Terms and Policies</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}