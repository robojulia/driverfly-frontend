import { PublicLayout } from "../components/layouts/public-layout";
import { Accordion } from "react-bootstrap";
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
      <div className="faq-sec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="faq-outer">
                <h1 className="mt-0 pb-3 font-weight-normal">
                  Frequently Asked Questions
                </h1>
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
                        Yes, if the quick apply approach from the job listing is not working for you, you can apply directly to the company&apos;s long form application, which should be accessible from the company&apos;s profile page.
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
                        That depends on the company you applied for&apos;s HR department. If you applied to the DriverFly general intake form (https://app.driverfly.co/apply/driverfly) our system will begin notifying you either within the next 24 hours if there are matches already in the system, otherwise as matching job opportunities roll in.
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
