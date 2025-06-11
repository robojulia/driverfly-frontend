import { PublicLayout } from "../components/layouts/public-layout";
import { Accordion } from "react-bootstrap";
import Breadcrumb from "../components/breadcrumbs/breadcrumb";
import { useTranslation } from "../hooks/use-translation";
import Link from "next/link";
import Head from "next/head";

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("FAQ_META_TITLE")}</title>
        <meta name="description" content={t("FAQ_META_DESC")} key="desc" />
      </Head>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t("FAQ")}</h2>
            <Breadcrumb />
          </div>
        </div>
      </div>

      <div className="faq-sec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-lg-6">
              <div className="faq-inner pl-3">
                <form action="#" method="#">
                  <div className="input-group shadow-sm">
                    <input
                      type="text"
                      placeholder="Search"
                      name="s"
                      className="form-control border-0  p-4 "
                    />
                    <span className="input-group-btn">
                      {" "}
                      <button type="submit" className="btn btn-sm btn-search">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </button>{" "}
                    </span>
                    <input
                      type="hidden"
                      name="post_type"
                      value="post"
                      className="post_type p-4"
                    />
                  </div>
                </form>
                <div className="faq_question_widget ">
                  <h3 className="title">
                    Contact us to learn about the trucking industry!
                  </h3>
                  <div className="widget_list">
                    <ul className="list_details">
                      <li>
                        <Link href="/contact">
                          Is the career in trucking right for me?
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact">
                          Can I work part time/ or weekends only?
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact">
                          Should I get hired on as a 1099 or W2?
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact">
                          How do I get a job in trucking?
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact">
                          Should I get endorsements?
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-6">
              <div className="faq-outer">
                <h2 className="mt-0 pb-3 font-weight-normal">
                  Frequently Asked Questions
                </h2>
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        I can&apos;t remember my user id and/or password, can you
                        reset it?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        If you&apos;ve lost both your password and username, reach
                        out to customer care at support@driverfly.co and enter
                        subject line &quot;Lost Username&quot;.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        I am having trouble with the online process, is there an
                        alternative method to apply?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Yes, you can simply apply for a job without logging in
                        by clicking the facebook icon below (if you have a
                        facebook profile) or by clicking apply without
                        registration.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        Do your services cost money for drivers?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        No. Our services are absolutely free for drivers looking
                        to find jobs. Moreover, by registering in our system,
                        you can become eligible to work with a dedicated
                        recruiter who will work to get you the best pay and home
                        time possible.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        What benefits does DriverFly offer?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        For CDL Drivers, it&apos;s a tool that allows you to get
                        placed fast and with a quality company who invests in
                        their drivers. You can also sign up to receive job
                        alerts and stay informed on the latest news and
                        discounts we have across the US.
                      </p>
                      <p>
                        For companies looking to hire, DriverFly offers a HUGE
                        pool of drivers for you to reach with your job offerings
                        as well as a streamlined approach to tracking and
                        managing your drivers through the hiring funnel.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        How can I find out who is the hiring manager or lead
                        recruiter on this posting?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>Email them 🙂 </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        I have several accounts, can they be purged or deleted?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Track your results on the local or global market ,
                        depending on your needs. You can track everything in the
                        most popular search engines – Google, Bing, Yahoo and
                        Yandex. Improve your search performance and increase
                        traffic with our turn-key.{" "}
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>
                      {" "}
                      <span className="btn-link">
                        {" "}
                        When can I expect to hear back from the hiring
                        department?
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        Expected response rates are around 8 hours on average.
                        However, many of our candidates are known to reply
                        within just a few hours from the time of application,
                        depending on when the driver applies.{" "}
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
FAQ.getLayout = function getLayout(page) {
  return <PublicLayout title="FAQ">{page}</PublicLayout>;
};
