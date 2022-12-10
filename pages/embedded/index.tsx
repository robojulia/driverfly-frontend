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
import Filters from "../../components/dashboard/driver/find-job/filters";
import OtrJobsList from "../../components/find-jobs/otr-job-list";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import { Row, Col } from 'react-bootstrap';
import JobsList from '../../components/embedded-jobs-listing/jobs-list'


export default function Embedded() {

    const jobApi = new JobApi()
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<JobEntity[]>([])

    const [pagingMeta, setPagingMeta] = useState<PagingMetaProps>(pagingMetaInitialValues())
    const resetPagingMeta = (): void => setPagingMeta(pagingMetaInitialValues)

    const [searchQuery, setSearchQuery] = useState<string>()
    const resetSearchQuery = (): void => setSearchQuery('')

    const [filters, setFilters] = useState<SearchJobsDto>(filtersInitialsValues)
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
            await jobApi.search({ ...filters as any })
                .then(({ items, meta }) => {
                    setJobs(items)
                    setPagingMeta(meta)
                })
        } catch (e) {
            toast.error(t('FIND_JOB_ERROR_GENERAL'))
        }
    }

    useEffectAsync(fetchJobs, [filters]);
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
                <div className="job-list_sec container mt-5">
                    <Filters />
                    <Row className='m-lg-0 mt-2'>
                        <Col className='col-12 my-2 p-lg-0'>
                            <ResultCount />
                            < JobsList />
                        </Col>
                    </Row>
                    {
                        (!!filters.location && !!filters.areas_covered && filters.areas_covered == JobGeography.OTR) &&
                        <Row className='mt-5'>
                            <Col className='col-12 my-lg-0 my-4'>
                                < OtrJobsList />
                            </Col>
                        </Row>
                    }
                </div>
            </JobContext.Provider>
        </PageLayout>
    )
}

Embedded.getLayout = function getLayout(page) {
    return (
        <EmbeddedLayout>
            {page}
        </EmbeddedLayout>
    )
}
