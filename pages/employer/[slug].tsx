import { ArrowRight, Facebook, Instagram, Linkedin, Telephone, Twitter } from "react-bootstrap-icons";
import CompanyInfo from "../../components/employer/company-info";
import CompanyJob from "../../components/employer/company-job";
import { PublicLayout } from "../../components/layouts/public-layout";
import { useTranslation } from "../../hooks/use-translation";
import CompanyApi from "../api/company";

import Link from "next/link";
import FlagCompany from "../../components/flag/flag-a-company";
import CompanyPhoto from "../../components/jobs/company-photo";
import JobApi from "../api/job";

export default function CompanyDetail({ company, jobs, jobCount, termonals }) {
	const { t } = useTranslation();

	const regex = `([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)`
	const validAbout = !!!(company.about?.match(regex))

	console.log("Company Data : ",company);

	return (
		<>
			<FlagCompany companyId={company.id} />

			<section className="bg-light py-4 pt-5">
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-lg-8 col-sm-12">
							<div className="row g-0 ">
								<div className="col-md-4  col-lg-4 col-sm-4 text-center  p-4  bg-white rounded">
									<CompanyPhoto
										className="img-fluid rounded-start"
										company={company}
									/>
								</div>
								<div className="col-md-8 col-lg-8 col-sm-8 p-4">
									<div className="card-body text-start">
										<div className="d-flex align-items-center">
											<h1 className="custom-trucker-title " >
												{company.name}
											</h1>
											<span
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Tooltip on top"
											></span>
										</div>
										<div className='my-3 '>
											{
												validAbout && company.about
											}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4  col-lg-4 col-sm-12 px-5">
							<div>
								<div className="my-3">
									<button type="button" className="custom-trucker-follow-btn .active:color-white" >
										<Telephone color="#fff" className="mx-2" size={20} />
										{company?.phone}
									</button>
								</div>
								<div className="my-3">
									<Link href={`https://app.driverfly.co/apply/${company.slug}`}>
										<a className="custom-trucker-review-btn text-white text-decoration-none d-block text-center">
											{t("APPLY_TODAY")}
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="my-4">
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-sm-12 col-lg-8">
							<div className='social-profile-sec my-4'>
								<h6>{t('SOCIAL_PROFILE')}:</h6>
								<div>
									<div className="hvr-float-shadow mx-3 ">
										<a target="_blank" rel="noreferrer" href={company?.facebook}>
											< Facebook color='#316FF6' size={25} />
										</a>
									</div>
									<div className="hvr-float-shadow mx-3">
										<a target="_blank" rel="noreferrer" href={company?.instagram}>
											< Instagram color=' #962fbf' size={25} />
										</a>
									</div>
									<div className="hvr-float-shadow mx-3">
										<a target="_blank" rel="noreferrer" href={company?.linkedin}>
											< Linkedin color=' #0077B5' size={25} />
										</a>
									</div>
									<div className="hvr-float-shadow mx-3">
										<a target="_blank" rel="noreferrer" href={company?.twitter}>
											< Twitter color=' #1DA1F2' size={25} />
										</a>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="w-100 rounded d-flex align-items-center pt-3 " style={{ background: '#2DA2AF' }}>
									<p style={{ fontSize: '22px', fontWeight: 'lighter', color: 'white' }}>{t("ACTIVE_JOB_LISTINGS")}</p>
								</div>
							</div>
							<CompanyJob jobs={jobs} />
							{!!jobCount && (
								<Link href={`/find-jobs?companyId=${company.id}`}>
									<a className="text-dark text-center text-decoration-none">
										{t("view_all_jobs")} <ArrowRight className="pl-1" />
									</a>
								</Link>
							)}
						</div>
						<CompanyInfo company={company} jobCount={jobCount} terminals={termonals} />

					</div>
				</div>
			</section>
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const slug = context.params?.slug || false;

		if (!!!slug) return { notFound: true };

		const companyApi = new CompanyApi();
		const jobApi = new JobApi();

		const company = await companyApi.employer.getBySlug(slug);
		if (!!!company) return { notFound: true };
		const jobCount = await companyApi.employer.getJobCount(company?.id) ?? 0;
		const termonals = await companyApi.employer.getTerminals(company?.id);
		const { items }: any = await jobApi.search({ companyId: company.id });

		if (!!!company) return { notFound: true };

		return { props: { company, jobs: items, jobCount, termonals } };
	} catch (error) {
		console.error("Exception is here:", error);
		return { props: { company: [], jobs: [] } };
	}
}

CompanyDetail.getLayout = function getLayout(page) {
	return <PublicLayout>{page}</PublicLayout>;
};
