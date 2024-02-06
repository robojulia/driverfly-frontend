import React from 'react'
import { ArrowRight } from 'react-bootstrap-icons'
import { useFormik } from 'formik';
import { useTranslation } from '../../hooks/use-translation';
import * as yup from 'yup';
import BaseInput from '../forms/base-input';

export default function NewsletterSingup() {

    const { t } = useTranslation();
    const form = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Invalid email address').trim().nullable(),
        }),
        onSubmit: async (values) => {
            console.log(values, "Email for news letter..............");
            alert(values)
        }
    })

    return (
        <>
            <div className=' d-flex flex-column align-items-center justify-content-center'>
                <h1 className='general-headings text-white mt-3 text-uppercase'>{t("NEWSLETTER_SIGN_UP")}</h1>
                <p>{t("SUBSCRIBE_TO_DRIVERFLY_PACIFIC_NEWALETTERTO_GET_THE_LATEST_JOBS_POSTED")}<br />{t("CANDIDATES_AND_OTHER_LATEST_NEWS")} ​</p>
                <div className=" my-3 w-50" >
                    <form onSubmit={form.handleSubmit} className=' w-100 ml-5 d-flex'>
                        {/* <div className="input-group input-group-lg"> */}
                        <BaseInput
                            className=" w-75   "
                            name="email"
                            placeholder="Enter Your Email"
                            type="text"
                            formik={form}
                        />
                        {/* <input type="text" className="form-control" placeholder='Enter Your Email' /> */}
                        <button type='submit' className="p-3 newletter-btn"
                            style={{ backgroundColor: "#2EC8C4", borderColor: "#2EC8C4" }}>
                            <ArrowRight color='#fff' />
                        </button>
                        {/* </div> */}
                    </form>
                </div>
            </div>
        </>
    )
}
