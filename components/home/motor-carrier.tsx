import Link from "next/link";
import { useTranslation } from "../../hooks/useTranslation";

export default function MotorCarrier() {

    const { t } = useTranslation();

    return (
        <section className="motor-carrier-bg">
            <div className="container text-center">
                <h1 className="motor-carrier">{t("ARE_YOU_A_MOTOR_CARRIER")}</h1>
                <button
                    className="theme-secondary-btn mt-5 px-5 py-3">
                    <Link href="http://go.driverfly.co/">
                        <a target="__blank"> {t("REQUEST_A_DEMO")}</a>
                    </Link>
                </button>
            </div>
        </section>
    )
}