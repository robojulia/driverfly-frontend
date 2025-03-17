import Link from "next/link";
import { useEffect, useState } from "react";
import { CurrencyDollar } from "react-bootstrap-icons";
import { useTranslation } from "../../hooks/use-translation";
import { JobEntity } from "../../models/job/job.entity";
import JobApi from "../../pages/api/job";
import { Pagination, PagingMeta } from "../../types/pagination.type";
import { buildAddress } from "../../utils/common";
import { useEffectAsync } from "../../utils/react";
import { scrollToTop } from "../../utils/scroll";
import timeSince from "../../utils/timeSince";
import CompanyPhoto from "../jobs/company-photo";
import { LoaderIcon } from "../loading/loader-icon";

export default function UsJobsList() {
    const { t } = useTranslation();
    const jobApi = new JobApi();

    const [usJobs, setUsJobs] = useState<JobEntity[]>([]);
    const [pagingMeta, setPagingMeta] = useState<PagingMeta>({
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 1,
    });
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUsJobs = async (page = 1) => {
        scrollToTop();
        try {
            setLoading(true);
            const { items, meta }: Pagination<JobEntity> = await jobApi.search({ page, }) as Pagination<JobEntity>
            console.log({ items, meta });
            setUsJobs(items);
            setPagingMeta(meta);
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffectAsync(async () => await fetchUsJobs(), []);

    useEffect(() => {
        return () => {
            setUsJobs(null);
            setLoading(null);
        };
    }, []);

    const renderPagination = () => {
        const { currentPage, totalPages } = pagingMeta;
        if (totalPages == 0) return null;

        return (
            <ul className="pagination">
                {currentPage > 2 && (
                    <li onClick={() => fetchUsJobs(1)}>
                        <span className="page-numbers " role="button">{t("FIRST_PAGE")}</span>
                    </li>
                )}
                {currentPage > 1 && (
                    <li onClick={() => fetchUsJobs(currentPage - 1)}>
                        <span className="page-numbers " role="button">{currentPage - 1}</span>
                    </li>
                )}
                <li >
                    <span className="page-numbers current active" role="button" >
                        {currentPage}
                    </span>
                </li>
                {currentPage < totalPages && (
                    <li onClick={() => fetchUsJobs(currentPage + 1)}>
                        <span className="page-numbers " role="button">{currentPage + 1}</span>
                    </li>
                )}
                {currentPage + 1 < totalPages && (
                    <li onClick={() => fetchUsJobs(totalPages)}>
                        <span className="page-numbers " role="button">{t("LAST_PAGE")}</span>
                    </li>
                )}
            </ul>
        );
    };

    const renderJobItem = (job: JobEntity) => (
        <div key={job.id} className="media align-items-center shadow-sm">
            <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
            <div className="media-body">
                <Link href={`/dashboard/driver/jobs/${job.id}`}>
                    <a className="text-decoration-none">
                        <h4 className="mt-0">{job.title}</h4>
                    </a>
                </Link>
                <div className="job-date-author">
                    {job.created_at && (
                        <>
                            {t("posted")} {timeSince(job.created_at)} {t("ago")}
                        </>
                    )}
                    {job.company?.name && (
                        <>
                            {t("by")}{" "}
                            <span role="button" className="employer text-theme">
                                {job.company.name}
                            </span>
                        </>
                    )}
                </div>
                <div className="job-metas text-secondary">
                    {job.location && (
                        <p>
                            <span className="mr-4">{buildAddress(job.location)}</span>
                        </p>
                    )}
                    <p>
                        <CurrencyDollar className="mr-1" />
                        {job.min_weekly_pay || 0} - {job.max_weekly_pay || 0}{" "}
                        {t("per_week")}
                    </p>
                    <strong className="text-secondary">{job.description_short}</strong>
                </div>
            </div>
            <Link href={`/dashboard/driver/jobs/${job.id}`}>
                <button type="button" className="theme-primary-btn-outline">
                    {t("view_job")}
                </button>
            </Link>
        </div>
    );

    return (
        <>
            <h2>{t("JOBS_FROM_US")}</h2>
            <LoaderIcon isLoading={loading} />
            <div className="results-count mt-4">
                {t("SHOWING")}{" "}
                {pagingMeta?.itemCount > 0 && (
                    <>
                        <span>
                            {(pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage + 1}
                        </span>{" "}
                        –{" "}
                        <span>
                            {(pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage +
                                pagingMeta.itemCount}
                        </span>{" "}
                        {t("OF")}
                    </>
                )}{" "}
                {pagingMeta?.totalItems} {t("RESULT")}
            </div>
            <div className="filter-outer mt-5">
                {usJobs?.map(renderJobItem)}
                <div className="filter-outer mt-5">{renderPagination()}</div>
            </div>
        </>
    );
}
