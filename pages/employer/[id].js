import { Bell, ArrowRight } from "react-bootstrap-icons";
import { PublicLayout } from "../../components/layouts/PublicLayout";
import CompanyInfo from "../../components/employer/CompanyInfo";
import CompanyJob from "../../components/employer/CompanyJob";
import CompanyApi from "../api/company";
import { useTranslation } from "../../hooks/useTranslation";
import JobApi from "../api/job";
import Link from "next/link";
import CompanyPhoto from "../../components/jobs/company-photo";
import FlagCompany from "../../components/flag/flag-a-company";

export default function CompanyDetail({ company, jobs, jobCount }) {
  const { t } = useTranslation();

  return (
    <>
      <FlagCompany companyId={company.id} />

      <section className="bg-light py-4 pt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-lg-8 col-sm-12">
              <div className="row g-0 ">
                <div className="col-md-4  col-lg-4 col-sm-4 text-center shadow p-3  bg-white rounded">
                  <CompanyPhoto
                    className="img-fluid rounded-start"
                    company={company}
                  />
                </div>
                <div className="col-md-8 col-lg-8 col-sm-8 ">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <h1 className="custom-trucker-title mx-2">
                        {company.name}
                      </h1>
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Tooltip on top"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4  col-lg-4 col-sm-12">
              <div>
                <div className="my-3">
                  <button type="button" className="custom-trucker-follow-btn">
                    <Bell color="#fff" className="mx-2" size={20} />
                    {t("FOLLOW_US")}
                  </button>
                </div>
                <div>
                  <button type="button" className="custom-trucker-review-btn">
                    {t("ADD_REVIEW")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="my-4">
        <div className="container">
          <CompanyInfo company={company} jobCount={jobCount} />
          <div className="row">
            <div className="col-md-8 col-sm-12 col-lg-8">
              {!!jobCount && (
                <Link href={`/find-jobs?companyId=${company.id}`}>
                  <a className="text-dark text-center text-decoration-none">
                    {t("view_all_jobs")} <ArrowRight className="pl-1" />
                  </a>
                </Link>
              )}
              <CompanyJob jobs={jobs} />
            </div>
            <div className="col-md-4 col-sm-12 col-lg-4"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const companyId = context.params?.id || false;

    if (!!!companyId) return { notFound: true };

    const companyApi = new CompanyApi();
    const jobApi = new JobApi();
    let company = null;
    let jobCount = 0;
    let jobs = [];

    await Promise.all([
      await companyApi.employer.getById(companyId),
      await companyApi.employer.getJobCount(companyId),
      await jobApi.search({ companyId, take: 3 }),
    ]).then(([data, counts, { items }]) => {
      company = data;
      jobCount = counts;
      jobs = items;
    });

    if (!!!company) return { notFound: true };

    return { props: { company, jobs, jobCount } };
  } catch (error) {
    console.error("Exception is here:", error);
    return { props: { company: [], jobs: [] } };
  }
}

CompanyDetail.getLayout = function getLayout(page) {
  return <PublicLayout>{page}</PublicLayout>;
};
