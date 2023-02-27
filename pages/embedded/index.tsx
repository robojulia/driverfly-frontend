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
import { JobEmploymentType } from '../../enums/jobs/job-employment-type.enum'
import { JobGeography } from '../../enums/jobs/job-geography.enum'
import { JobTeamDriver } from '../../enums/jobs/job-team-driver.enum'
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum'
import EmploymentType from '../../components/filters/employment-type'


export default function Embedded({ filterType }) {

    const router = useRouter()
    const jobApi = new JobApi()
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<JobEntity[]>([])

    const [pagingMeta, setPagingMeta] = useState<PagingMetaProps>(pagingMetaInitialValues)
    const resetPagingMeta = (): void => setPagingMeta(pagingMetaInitialValues)

    const [searchQuery, setSearchQuery] = useState<string>()
    const resetSearchQuery = (): void => setSearchQuery('')

    /**
     * @param {EmbeddedFilterTypes} type - EmbeddedFilterTypes
     */
    const filtersForQuery = (type: EmbeddedFilterTypes): SearchJobsDto => ({
        [EmbeddedFilterTypes.CDL_SCHOOLS]: setFiltersForCdlSchools(),
        [EmbeddedFilterTypes.HEAVY_HAUL]: setFiltersForHeavyHaul(),
        [EmbeddedFilterTypes.OWNER_OPERATOR]: setFiltersForOwnerOperator(),
        [EmbeddedFilterTypes.NEW_HIRES]: setFiltersForNewHires(),
        [EmbeddedFilterTypes.TEAM_DRIVERS]: setFiltersForTeamDrivers(),
        [EmbeddedFilterTypes.OTR_JOBS]: setFiltersForOtrJobs(),
    }[type] || {})

    const setFiltersForCdlSchools = (): SearchJobsDto => ({
        cdl_class: DriverLicenseType.CDL_CLASS_A,
        employment_type: JobEmploymentType.W2,
        max_years_experience: 0.6,
    })
    const setFiltersForHeavyHaul = (): SearchJobsDto => ({
        cdl_class: DriverLicenseType.CDL_CLASS_A,
        equipment_type: JobEquipmentType.FLATBED,
    })
    const setFiltersForOwnerOperator = (): SearchJobsDto => ({
        cdl_class: DriverLicenseType.CDL_CLASS_A,
        employment_type: JobEmploymentType.OWNER_OPERATOR,
    })
    const setFiltersForNewHires = (): SearchJobsDto => ({
        cdl_class: DriverLicenseType.CDL_CLASS_A,
        max_years_experience: 0.6,
        employment_type: JobEmploymentType.W2,
    })
    const setFiltersForTeamDrivers = (): SearchJobsDto => ({
        cdl_class: DriverLicenseType.CDL_CLASS_A,
        areas_covered: [JobGeography.OTR, JobGeography.REGIONAL],
        team_drivers: JobTeamDriver.HAS_TEAM_DRIVER,
    })
    const setFiltersForOtrJobs = (): SearchJobsDto => ({
        cdl_class: DriverLicenseType.CDL_CLASS_A,
        areas_covered: [JobGeography.OTR, JobGeography.REGIONAL],
    })

    const [filters, setFilters] = useState<SearchJobsDto>(filtersForQuery(filterType))
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
                                <EmbeddedFilters filterType={filterType} />
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

    return { props: { filterType } }
}
Embedded.getLayout = function getLayout(page) {
    return (
        <EmbeddedLayout>
            {page}
        </EmbeddedLayout>
    )
}
