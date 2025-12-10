import { useTranslation } from "../../hooks/use-translation";

export default function DriversNewsletter() {

    const { t } = useTranslation();

    return (
        <div id="newsletter-section">
            <div className="footer-inner">
                <h3 className="widget-title font-weight-normal">{t("DRIVER_ALERTS")}</h3>
                <ul className="p-0">
                    <p className="text-secondary mb-4">{t("SUBSCRIBE_TO_THE_DRIVERFLY_NEWSLETTER")}</p>
                    <form action="">
                        <input type="email" className="form-control font-weight-light" placeholder={`${t("EMAIL_ADDRESS")}`} style={{ height: '38px' }} />
                        <button type="submit" className="theme-primary-btn btn-block mt-3" style={{ textAlign: 'center', display: 'block', width: '100%' }}>Send</button>
                    </form>
                </ul>
            </div>
        </div>
    )
}