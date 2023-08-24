import 'bootstrap/dist/css/bootstrap.css'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from "react"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import FilterResult from '../components/filter-results/filter-results'
import JobsList from '../components/jobslisting/jobslist'
import { PublicLayout } from "../components/layouts/public-layout";
import JobContext from "../context/job-context"
import JobApi from "./api/job"
import Sort from "../components/find-jobs/sort"
import ResultCount from "../components/find-jobs/result-count"
import { JobEntity } from '../models/job/job.entity'
import { filtersInitialsValues, pagingMetaInitialValues } from '../utils/job-filter'
import { JobSearchLocation, SearchJobsDto } from '../models/job/search-jobs-dto'
import { useEffectAsync } from '../utils/react'
import { GetServerSidePropsContext } from 'next'
import { toast } from "react-toastify";
import { useTranslation } from '../hooks/use-translation'
import { Pagination, PagingMeta } from '../types/pagination.type'
import Head from 'next/head'

export default function FindJobs(props) {

    let { params } = props

    const router = useRouter()
    const jobApi = new JobApi()
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<JobEntity[]>([])

    const [pagingMeta, setPagingMeta] = useState<PagingMeta>(pagingMetaInitialValues)
    const resetPagingMeta = (): void => setPagingMeta(pagingMetaInitialValues)

    const [searchQuery, setSearchQuery] = useState<string>()
    const resetSearchQuery = (): void => setSearchQuery('')

    const [filters, setFilters] = useState<SearchJobsDto>({ ...params })
    const resetFilters = (): void => setFilters(filtersInitialsValues)

    const [location, setLocation] = useState<JobSearchLocation>(null)
    const resetLocation = (): void => setLocation(null)

    const [range, setRange] = useState<string>(`${filters.location?.range || 50}`)
    const resetRange = (): void => setRange(null)

    const handleReset = (): void => {
        resetSearchQuery()
        resetPagingMeta()
        resetFilters()
        resetLocation()
        resetRange()
    }

    const setFiltersByKeyValue = (key: string, value: any): void => {
        setFilters({
            ...filters,
            page: 1,
            [key]: value
        })
    }

    const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>): void => setFiltersByKeyValue(name, value)

    const setNativeValue = (element: HTMLInputElement, value: any) => {
        if (!element) {
            return
        }
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    const setFiltersForQuery = async (): Promise<void> => {
        Object.keys(params).map(key => {
            let inputs: any = document.getElementsByName(key)
            if (!inputs.length) {
                return
            }
            if (inputs[0].tagName.toLowerCase() !== "input") {
                return
            }
            if (inputs[0].type.toLowerCase() === "text") {
                setNativeValue(inputs[0], params[key]);
            }
            if (inputs[0].type.toLowerCase() === "radio") {
                inputs.forEach(input => {
                    if (input.value === params[key]) {
                        input.checked = true;
                    }
                })
            }
        })
        if (params.hasOwnProperty('keywords')) {
            setSearchQuery(params.keywords)
        }
        if (params.hasOwnProperty('long') && params.hasOwnProperty('lat')) {
            setFiltersByKeyValue("location", {
                "place_name": params.place_name,
                "lat": params.lat,
                "long": params.long,
                "range": params.range || 1500
            });
        }
        params = {}
    }

    const fetchJobs = async (): Promise<void> => {
        try {
            navigator.geolocation.getCurrentPosition(function (position) {
                setFiltersByKeyValue("location", {
                    "lat": position.coords.latitude,
                    "long": position.coords.longitude,
                    "range": 1500
                });
            });

            await jobApi.search({ ...filters as any })
                .then(({ items, meta }: Pagination<JobEntity>) => {
                    console.log({ items, meta, filters });
                    setJobs(items)
                    setPagingMeta(meta)
                })
        } catch (e) {
            toast.error(t('FIND_JOB_ERROR_GENERAL'))
        }
    }

    useEffectAsync(fetchJobs, [filters])
    useEffectAsync(async (): Promise<void> => {
        try {
            await setFiltersForQuery()
            await router.replace('find-jobs', undefined, { shallow: true });
            await fetchJobs()
        } catch (e) {
            toast.error(t('FIND_JOB_ERROR_GENERAL'))
        }
    }, [])

    return (
        <JobContext.Provider value={{
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
        }}>
        <Head>
        <title>
        {t("FIND_JOBS_META_TITLE")}</title>
        <meta
          name="description"
          content= {t("FIND_JOBS_META_DESC")}        key="desc"
        />
        </Head>
            <div className="filter-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3 lg-mt-0 mt-5">
                            < FilterResult />
                        </div>
                        <div className="col-md-9 outer pl-4 ">

                            <ResultCount />

                            <div className="filter-btn-groups mt-3">
                                <Sort />
                            </div>

                            < JobsList />

                        </div>
                    </div>
                </div>
            </div>
        </JobContext.Provider>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            params: context.query
        }
    }
}

FindJobs.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="FIND_A_Job">
            {page}
        </PublicLayout>
    )
}
