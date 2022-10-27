import { useTranslation } from "../../hooks/use-translation";

export default function DriversNewsletter() {

    const { t } = useTranslation();

    return (
        <div id="newsletter-section">
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">{t("DRIVER_ALERTS")}</h2>
                <ul className="p-0">
                    <p className="text-secondary mb-4">{t("SUBSCRIBE_TO_THE_DRIVERFLY_NEWSLETTER")}</p>
                    <form action="">
                        <input type="email" className="form-control" placeholder="Email Adress" />
                        <button type="submit" className="theme-primary-btn btn-block mt-3">{t("submit")}</button>
                    </form>
                </ul>
            </div>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">{t("COMPANY_NEWSLETTER")}</h2>
                <p className="text-secondary mb-4">{t("SUBSCRIBE_TO_THE_DRIVERFLY_NEWSLETTER_TO_GET_THE_LATEST")} <br /> {t("DISCOUNT_CODES_&_AOUPONS")}</p>
                <ul className="p-0">

                    <form action="">
                        <input type="email" className="form-control" placeholder="Email Adress" />
                        <button type="submit" className="theme-primary-btn btn-block mt-3">{t("submit")}</button>
                    </form>
                </ul>
            </div>
        </div>
    )
}