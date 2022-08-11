import Link from "next/link";
export default function DriversNewsletter
    () {
    return (
        <div id="newsletter-section">
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">Driver Alerts</h2>
                <ul className="p-0">
                    <p className="text-secondary mb-4">Subscribe to the DriverFly Newsletter to get the latest jobs feeds.</p>
                    <form action="">
                        <input type="email" className="form-control" placeholder="Email Adress" />
                        <button type="submit" className="theme-primary-btn btn-block mt-3">Submit</button>
                    </form>
                </ul>
            </div>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">
                    Company Newsletter</h2>
                <p className="text-secondary mb-4">Subscribe to the DriverFly Newsletter to get the latest <br /> discount codes & coupons, and major news headlines.</p>
                <ul className="p-0">

                    <form action="">
                        <input type="email" className="form-control" placeholder="Email Adress" />
                        <button type="submit" className="theme-primary-btn btn-block mt-3">Submit</button>
                    </form>
                </ul>
            </div>
        </div>
    )
}