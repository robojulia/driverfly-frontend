import Head from "next/head";
import { PublicLayout } from "../components/layouts/public-layout";
import Slider from "../components/testominial-slider/slider";
import { useTranslation } from "../hooks/use-translation";
import Companies from "../components/works/companies";
import Link from "next/link";

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("ABOUT_META_TITLE")}</title>
        <meta name="description" content={t("ABOUT_META_DESC")} key="desc" />
      </Head>

      <div className="about-sec">
        <div className="about-linear">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-lg-4">
                <img
                  src="img/mockup-of-a-happy-customer-showing-off-his-t-shirt-inside-a-modern-office-26189-4.png"
                  alt=""
                  className="about-img img-fluid"
                />
              </div>
              <div className="col-sm-12 col-lg-8">
                <div className="about-inner">
                  <h2 style={{ color: 'white' }}>{t("ABOUT_DRIVERFLY")}</h2>
                  <p>{t("DRIVERFLY_WAS_BUILT_AS_A_DIGITAL_PLATFORM")}</p>
                  <p>{t("UNLIKE_TRADITIONAL_JOB_BOARDS")}</p>
                  <p>{t("WITH_JOBS_ACROSS_THE_ENTIRE_US")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="who-we-serve-sec">
        <div className="container">
          <div className="d-flex flex-column">
            <div className="col-md-12">
              <h2 style={{ color: 'black' }}>Who We Serve</h2>
              <div className="row">
                <div className="col">
                  <div className="who-we-serve-inner">
                    <h3>{t("PROSPECTIVE_DRIVERS")}</h3>
                    <p>{t("CONSIDERING_A_NEW_CAREER_AS_A_DRIVER")}</p>
                  </div>
                  <div className="who-we-serve-inner">
                    <h3>{t("OWNER_OPS")}</h3>
                    <p>{t("TRIED_OF_JUGGLING_BOTH_RUNNING_A_COMPANY")}</p>
                  </div>
                </div>
                <div className="col">
                  <div className="who-we-serve-inner">
                    <h3>{t("NEW_DRIVERS")}</h3>
                    <p>{t("JUST_GOT_CDL_AND_NOW_LOOKING_FOR_WORK?")}</p>
                  </div>
                  <div className="who-we-serve-inner">
                    <h3>{t("DROWING_BUSINESSES")}</h3>
                    <p>{t("WE_BELIEVE_THE_MORE_EDUCATED")}</p>
                  </div>
                </div>
                <div className="col">
                  <div className="who-we-serve-inner">
                    <h3>{t("EXPERIENCED_DRIVERS")}</h3>
                    <p>{t("WE_PROVIDE_A_VARIETY_OF_JOB_APPORTUNITIES")}</p>
                    <p>{t("NOT_SURE_HOW_TO_START_?")}</p>
                  </div>
                  <div className="who-we-serve-inner">
                    <h3>{t("SUPPPORT_SERVICES")}</h3>
                    <p>{t("GOT_A_BUSINESS_THAT_SUPPORT_TRUCK_DRIVERS")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 who-we-outer">
              <div className="who-we-img ">
                <img
                  src="img/mockup-of-a-man-with-a-crewneck-t-shirt-leaning-on-a-truck-29466-1.png"
                  alt=""
                  className=""
                />
                <img
                  src="img/mockup-man-siting-with-df-shirt.png"
                  alt=""
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonial-sec about-testominial">
        <div className="container">
          <h2 className="text-center" style={{ color: 'black' }}>{t("WHAT_DRIVERS_SAY_ABOUT_US")}</h2>
          <Slider />
        </div>
      </div>
      <div className="">
        <div className="col-md-12">
          <div className="partners">
            <h2 style={{ color: 'black' }}>{t("PARTNERS")}</h2>
            <img src="img/wilds_logo_250.png" alt="" className="img-fluid" />
            <h3 className="my-4">
              {t("WONEN_IN_LOGISTICS_AND_DELIVERY_SERVICES_(WILDS)")}
            </h3>
            <p>{t("DRIVERFLY_IS_A_PROUD_OF_WILDS")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

About.getLayout = function getLayout(page) {
  return <PublicLayout title="ABOUT">{page}</PublicLayout>;
};
