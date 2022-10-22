import { useRouter } from "next/router";
import { useTranslation } from "../../hooks/use-translation";

export default function OwnerOperators() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <section>
            <div className="opacity-overly">
                <section className="owner-operator-bg">
                    <div className="container text-center">
                        <h1 className="owner-operator-title">{t("OWNER_OPERATORS")}</h1>
                        <p className="owner-operatot-text">
                            {t("ARE_YOU_LOOKING_TO_LEASE_ONTO_MOTOR_CARRIER")}
                        </p>
                        <button
                            className="white-bg-btn"
                            onClick={() => router.push({ pathname: 'find-jobs', query: { "employment_type": 'OWNER_OPERATOR' } })}>
                            {t("LEASE_ONTO_A_CARRIER")}
                        </button>
                    </div>
                </section>
            </div>
        </section>
    )
}