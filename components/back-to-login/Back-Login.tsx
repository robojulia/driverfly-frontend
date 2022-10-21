import Back from '../../public/css/BackToLogin.module.css'
import Link from 'next/link'
import { useTranslation } from '../../hooks/useTranslation';

export default function BackToLogin() {
    const { t } = useTranslation();

    return (
        <>
            <p className=" my-5 text-secondary  p-lg-0 p-2 ">{t("DON'T_HAVE_AN_ACCOUNT")}
                <Link href="/signup">
                    <a className={Back.link}> {t("HERE!")}</a>
                </Link>
            </p>
        </>
    )

}
