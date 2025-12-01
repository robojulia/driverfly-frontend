import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Chat, Clock } from "react-bootstrap-icons";
import { PublicLayout } from "../components/layouts/public-layout";
import Blog from "../public/css/blog.module.css";
import BlogSidebar from "../components/blog-sidebar/blog-sidebar";
import { useTranslation } from "../hooks/use-translation";
export default function Blogs() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("BLOG_META_TITLE")}</title>
        <meta name="description" content={t("BLOG_META_DESC")} key="desc" />
      </Head>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>{t("BLOG")}</h2>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-8 col-sm-12">
            <div className="my-3">
              <div className="row border-bottom pb-3">
                <div className="col-lg-4 col-md-4 p-0  ">
                  <div className={Blog.postthumbnail}>
                    <img src="img/Freight1.jpg" />
                  </div>
                  <div className={Blog.custombtn}></div>
                  <div className={Blog.cusbtn}>
                    <button className="form-control bt btn-lg mt-2 ml-3 text-center text-white">
                      Changes in Trucking
                    </button>
                  </div>
                </div>
                <div className="col-lg-7 col-md-7 col-12 d-flex align-items-center">
                  <div className={Blog.topinfo}>
                    <h4 className="font-weight-normal mb-2">
                      What Is This New ELDT Program You Speak Of?
                    </h4>
                    <a className={Blog.time} href="#">
                      <Clock />
                      January 26, 2022
                    </a>
                    <span className={Blog.comments}>
                      <Chat /> 0 Comments
                    </span>
                    <p className={Blog.description}>
                      Starting February 7, 2022, the Entry-Level Driver Training
                      (ELDT) regulations will be changed, now requiring all
                      aspiring CDL drivers to receive ...
                    </p>
                    <Link
                      href="/blog-eldt"
                      className={`${Blog.readmore} hvr-underline-reveal`}
                    >
                      Read More <ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-3">
              <div className="row border-bottom pb-3">
                <div className="col-lg-4 col-md-4 p-0  ">
                  <div className={Blog.postthumbnail}>
                    <img src="img/driver-getting.jpg" />
                  </div>

                  <div className={Blog.custombtn}></div>
                  <div className={Blog.cusbtn}>
                    <button className="form-control bt btn-lg mt-2 ml-3 text-center text-white">
                      Tips and Tricks
                    </button>
                  </div>
                </div>
                <div className="col-lg-7 col-md-7 col-12 d-flex align-items-center">
                  <div className={Blog.topinfo}>
                    <h4 className="font-weight-normal mb-2">
                      Finding Your Dream Trucking Job: 3 Quick & Easy Tips
                    </h4>
                    <a className={Blog.time} href="#">
                      <i className="flaticon-clock "></i>October 8, 2021
                    </a>
                    <span className={Blog.comments}>
                      <i className="flaticon-chat"></i>0 Comments
                    </span>
                    <p className={Blog.description}>
                      It&apos;s easy to find a trucking job quickly, but what about
                      finding your dream trucking job? How do you find the ...
                    </p>
                    <Link
                      href="/blog-tips"
                      className={`${Blog.readmore} hvr-underline-reveal`}
                    >
                      Read More <ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12 col-lg-4">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
Blogs.getLayout = function getLayout(page) {
  return <PublicLayout title="blog">{page}</PublicLayout>;
};
