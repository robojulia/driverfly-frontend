import React from 'react'
import { ArrowRight } from 'react-bootstrap-icons'
import { useTranslation } from '../../hooks/use-translation';
export default function NewsletterSingup() {

    const { t } = useTranslation();

    return (
        <>
            <div className='d-flex flex-column align-items-center justify-content-center'>
                <h1 className='general-headings text-white mt-3 text-uppercase'>{t("NEWSLETTER_SIGN_UP")}</h1>
                <p>{t("SUBSCRIBE_TO_DRIVERFLY_PACIFIC_NEWALETTERTO_GET_THE_LATEST_JOBS_POSTED")}<br />{t("CANDIDATES_AND_OTHER_LATEST_NEWS")} ​</p>
                <div className="input-group my-3 w-50" >
                    <div className="input-group input-group-lg">
                        <input type="text" className="form-control" placeholder='Enter Your Email' />
                        <span className="input-group-text" id="inputGroup-sizing-lg"
                            style={{ backgroundColor: "#2EC8C4", borderColor: "#2EC8C4" }}>
                            <ArrowRight color='#fff' />
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
