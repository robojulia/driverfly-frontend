import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import { Container, Row, Col } from 'react-bootstrap';
import JobApi from '../../../api/job';
import { useEffect, useState } from 'react';
import jobsContext from "../../../../context/jobContext"
import JobsList from "../../../../components/find-jobs/job-list";
import ResultCount from "../../../../components/find-jobs/result-count"
import Filters from "../../../../components/dashboard/driver/find-job/filters";
import OtrJobsList from "../../../../components/find-jobs/otr-job-list";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { useEffectAsync } from "../../../../utils/react";
import PageLayout from "../../../../components/layouts/page/PageLayout";
import { JobEntity } from "../../../../models/job/job.entity";
import { filtersInitialsValues, pagingMetaInitialValues, PagingMetaProps } from "../../../../utils/job-filter";
import { JobSearchLocation, SearchJobsDto } from "../../../../models/job/search-jobs-dto";

export default function FindJobs() {

    const jobApi = new JobApi();
    const [jobs, setJobs] = useState<JobEntity[]>([])

    const [pagingMeta, setPagingMeta] = useState<PagingMetaProps>(pagingMetaInitialValues)
    const resetPagingMeta = (): void => setPagingMeta(pagingMetaInitialValues)

    const [searchQuery, setSearchQuery] = useState<string>();
    const resetSearchQuery = (): void => setSearchQuery('')

    const [filters, setFilters] = useState<SearchJobsDto>(filtersInitialsValues)
    const resetFilters = (): void => setFilters(filtersInitialsValues)

    const [location, setLocation] = useState<JobSearchLocation>(null);
    const resetLocation = (): void => setLocation(null)

    const [range, setRange] = useState<string>(`${filters.location?.range || 50}`);
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

    const handleChange = ({ target: { name, value } }): void => setFiltersByKeyValue(name, value)

    const fetchJobs = async (): Promise<void> => {
        console.log("filters", filters);

        await jobApi.search({ ...filters as any })
            .then(({ items, meta }) => {
                setJobs(items)
                setPagingMeta(meta)
            })
    }

    useEffectAsync(fetchJobs, [filters]);

    return (
        <PageLayout
            title="FIND_JOBS"
        >
            <jobsContext.Provider value={{
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
                <Container fluid>
                    <Filters />
                    <Row className='mt-5'>
                        <Col className='col-12 my-lg-0 my-4'>
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
                </Container>
            </jobsContext.Provider>
        </PageLayout>
    )
};

FindJobs.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
