import "bootstrap/dist/css/bootstrap.css";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState, useCallback } from "react";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { toast } from "react-toastify";
import FilterResult from "../components/filter-results/filter-results";
import ResultCount from "../components/find-jobs/result-count";
import Sort from "../components/find-jobs/sort";
import UsJobsList from "../components/find-jobs/us-job-list";
import JobsList from "../components/jobslisting/jobslist";
import { PublicLayout } from "../components/layouts/public-layout";
import { LoaderIcon } from "../components/loading/loader-icon";
import JobContext from "../context/job-context";
import { useTranslation } from "../hooks/use-translation";
import { JobEntity } from "../models/job/job.entity";
import {
	JobSearchLocation,
	SearchJobsDto,
} from "../models/job/search-jobs-dto";
import { Pagination, PagingMeta } from "../types/pagination.type";
import {
	filtersInitialsValues,
	pagingMetaInitialValues,
} from "../utils/job-filter";
import { useEffectAsync } from "../utils/react";
import { scrollToTop } from "../utils/scroll";
import JobApi from "./api/job";


export default function FindJobs(props) {
	let { params } = props;

	const router = useRouter();
	const jobApi = useMemo(() => new JobApi(), []);
	const { t } = useTranslation();

	const [loading, setLoading] = useState<boolean>(true);
	const [jobs, setJobs] = useState<JobEntity[]>([]);
	const [pagingMeta, setPagingMeta] = useState<PagingMeta>(pagingMetaInitialValues);
	const [searchQuery, setSearchQuery] = useState<string>();
	const [filters, setFilters] = useState<SearchJobsDto>({ ...params });
	const [location, setLocation] = useState<JobSearchLocation>(null);
	const [range, setRange] = useState<string>(`${filters.location?.range || 50}`);

	const resetPagingMeta = useCallback((): void => setPagingMeta(pagingMetaInitialValues), []);
	const resetSearchQuery = useCallback((): void => setSearchQuery(""), []);
	const resetFilters = useCallback((): void => setFilters(filtersInitialsValues), []);
	const resetLocation = useCallback((): void => setLocation(null), []);
	const resetRange = useCallback((): void => setRange(""), []);

	const handleReset = useCallback((): void => {
		resetSearchQuery();
		resetPagingMeta();
		resetFilters();
		resetLocation();
		resetRange();
	}, [resetSearchQuery, resetPagingMeta, resetFilters, resetLocation, resetRange]);

	const setFiltersByKeyValue = useCallback((key: string, value: any): void => {
		setFilters((prevFilters) => ({
			...prevFilters,
			page: 1,
			[key]: value,
		}));
	}, []);

	const handleChange = useCallback(({
		target: { name, value },
	}: ChangeEvent<HTMLInputElement>): void => setFiltersByKeyValue(name, value), [setFiltersByKeyValue]);

	const setNativeValue = (element: HTMLInputElement, value: any) => {
		if (!element) {
			return;
		}
		const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
		const prototype = Object.getPrototypeOf(element);
		const prototypeValueSetter = Object.getOwnPropertyDescriptor(
			prototype,
			"value"
		).set;

		if (valueSetter && valueSetter != prototypeValueSetter) {
			prototypeValueSetter.call(element, value);
		} else {
			valueSetter.call(element, value);
		}
	};

	const setFiltersForQuery = async (): Promise<void> => {
		typeof params == "object" &&
			Object.keys(params)?.map((key) => {
				let inputs: any = document.getElementsByName(key);
				if (!inputs?.length) {
					return;
				}
				if (inputs[0].tagName.toLowerCase() != "input") {
					return;
				}
				if (inputs[0].type.toLowerCase() == "text") {
					setNativeValue(inputs[0], params[key]);
				}
				if (inputs[0].type.toLowerCase() == "radio") {
					inputs.forEach((input) => {
						if (input.value == params[key]) {
							input.checked = true;
						}
					});
				}
			});
		if (params?.hasOwnProperty("keywords")) {
			setSearchQuery(params?.keywords);
		}
		if (params?.hasOwnProperty("long") && params?.hasOwnProperty("lat")) {
			setFiltersByKeyValue("location", {
				place_name: params?.place_name,
				lat: params?.lat,
				long: params?.long,
				range: params?.range || 1500,
			});
		}
		params = {};
	};

	const fetchJobs = useCallback(async (): Promise<void> => {
		setLoading(true);
		try {
			// navigator.geolocation.getCurrentPosition(function (position) {
			// 	setFiltersByKeyValue("location", {
			// 		lat: position.coords.latitude,
			// 		long: position.coords.longitude,
			// 		range: 1500,
			// 	});
			// });

			await jobApi
				.search({ ...(filters as any) })
				.then(({ items, meta }: Pagination<JobEntity>) => {
					// console.log({ items, meta, filters });
					setJobs(items);
					setPagingMeta(meta);
				});
		} catch (e) {
			console.log("Error", e.message, e);
			toast.error(t("FIND_JOB_ERROR_GENERAL"));
		} finally {
			setLoading(false);
		}
	}, [jobApi, filters, t]);

	useEffectAsync(fetchJobs, [filters]);
	useEffectAsync(async (): Promise<void> => {
		try {
			await setFiltersForQuery();
			await router.replace("find-jobs", undefined, { shallow: true });
			await fetchJobs();
		} catch (e) {
			console.log("Error", e.message, e);
			toast.error(t("FIND_JOB_ERROR_GENERAL"));
		}
	}, []);

	useEffect(() => scrollToTop(), [filters.page]);

	const contextValue = useMemo(
		() => ({
			state: {
				jobs,
				pagingMeta,
				filters,
				location,
				range,
				searchQuery,
			},
			method: {
				handleChange,
				setFilters,
				setLocation,
				setRange,
				setFiltersByKeyValue,
				applyFilters: fetchJobs,
				setSearchQuery,
				handleReset,
				handlePaging: setPagingMeta,
			},
		}),
		[jobs, pagingMeta, filters, location, range, searchQuery, fetchJobs, handleChange, handleReset, setFiltersByKeyValue]
	);

	return (
		<JobContext.Provider value={contextValue}>
			<Head>
				<title>{t("FIND_JOBS_META_TITLE")}</title>
				<meta
					name="description"
					content={t("FIND_JOBS_META_DESC")}
					key="desc"
				/>
			</Head>
			<div className="filter-sec">
				<div className="container">
					<div className="row">
						<div className="col-12 col-lg-3 lg-mt-0 mt-4">
							<FilterResult />
						</div>
						<div className="col-md-9 outer pl-4 ">
							<LoaderIcon isLoading={loading} />
							<ResultCount />

							<div className="filter-btn-groups mt-3">
								<Sort />
							</div>

							<JobsList />

							{!jobs.length && !!filters.location && !loading && (
								<UsJobsList />
							)}

						</div>
					</div>
				</div>
			</div>
		</JobContext.Provider>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	return {
		props: {
			params: context.query,
			// params: {},
		},
	};
}

FindJobs.getLayout = function getLayout(page) {
	return <PublicLayout title="FIND_A_Job">{page}</PublicLayout>;
};
