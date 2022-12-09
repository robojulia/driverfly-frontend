import 'bootstrap/dist/css/bootstrap.css'
import { ChangeEvent, useState } from "react"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import { EmbeddedLayout } from '../../components/layouts/embedded/embedded-layout'
import JobApi from "../api/job"
import { JobEntity } from '../../models/job/job.entity'
import { filtersInitialsValues, pagingMetaInitialValues, PagingMetaProps } from '../../utils/job-filter'
import { useEffectAsync } from '../../utils/react'
import { toast } from "react-toastify";
import { useTranslation } from '../../hooks/use-translation'
import PageLayout from '../../components/layouts/page/page-layout'
import JobContext from "../../context/job-context"
import { JobSearchLocation, SearchJobsDto } from "../../models/job/search-jobs-dto";
import ResultCount from "../../components/find-jobs/result-count"
import JobsList from '../../components/embedded-jobs-listing/jobs-list'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import EmbeddedFilters from '../../components/embedded-filters/embedded-filters'
import { EmbeddedFilterTypes } from '../../enums/embedded/embedded-filter-types.enum'
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum'


export default function Embedded({ filterType }) {

    const router = useRouter()
    const jobApi = new JobApi()
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<JobEntity[]>([])

    const [pagingMeta, setPagingMeta] = useState<PagingMetaProps>(pagingMetaInitialValues)
    const resetPagingMeta = (): void => setPagingMeta(pagingMetaInitialValues)

    const [searchQuery, setSearchQuery] = useState<string>()
    const resetSearchQuery = (): void => setSearchQuery('')

    const [filters, setFilters] = useState<SearchJobsDto>({})
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
        switch (filterType) {
            case EmbeddedFilterTypes.CDL_SCHOOLS:
                setFiltersByKeyValue("cdl_class", DriverLicenseType.CDL_CLASS_A)
                break;
            case EmbeddedFilterTypes.HEAVY_HAUL:
                setFiltersByKeyValue("cdl_class", DriverLicenseType.CDL_CLASS_A)
                break;
            case EmbeddedFilterTypes.OWNER_OPERATOR:
                setFiltersByKeyValue("cdl_class", DriverLicenseType.CDL_CLASS_A)
                break;
            case EmbeddedFilterTypes.NEW_HIRES:
                setFiltersByKeyValue("cdl_class", DriverLicenseType.CDL_CLASS_A)
                break;
            case EmbeddedFilterTypes.TEAM_DRIVERS:
                setFiltersByKeyValue("cdl_class", DriverLicenseType.CDL_CLASS_A)
                break;
            case EmbeddedFilterTypes.OTR_JOBS:
                setFiltersByKeyValue("cdl_class", DriverLicenseType.CDL_CLASS_A)
                break;
            default:
                break;
        }

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
                .then(({ items, meta }) => {
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
            await setFiltersForQuery();
            // await router.replace('embedded', undefined, { shallow: true });
            await fetchJobs()
        } catch (e) {
            toast.error(t('FIND_JOB_ERROR_GENERAL'))
        }
    }, [])
    return (
        <PageLayout>
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
                    handlePaging: setPagingMeta,
                    setFilters,
                    setLocation,
                    setRange,
                    setFiltersByKeyValue,
                    applyFilters: fetchJobs,
                    setSearchQuery,
                    handleReset
                },
            }}>
                <div className="filter-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-3 lg-mt-0 mt-5">
                                <EmbeddedFilters filterType />
                            </div>
                            <div className="col-md-9 outer pl-4 ">

                                <ResultCount />
                                < JobsList />

                            </div>
                        </div>
                    </div>
                </div>
            </JobContext.Provider>
        </PageLayout>
    )
}
export async function getServerSideProps({ query }: GetServerSidePropsContext) {

    const { filterType } = query || {};

    if (!!!filterType) return { notFound: true }
    return {
        props: {
            filterType
        }
    }
}
Embedded.getLayout = function getLayout(page) {
    return (
        <EmbeddedLayout>
            {page}
        </EmbeddedLayout>
    )
}
