import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import { Container, Row, Col } from 'react-bootstrap';
import JobApi from '../../../api/job';
import { useState } from 'react';
import jobsContext from "../../../../context/jobContext"
import JobsList from "../../../../components/find-jobs/job-list";
import ResultCount from "../../../../components/find-jobs/result-count"
import Filters from "../../../../components/dashboard/driver/find-job/filters";
import OtrJobsList from "../../../../components/find-jobs/otr-job-list";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { useEffectAsync } from "../../../../utils/react";
import PageLayout from "../../../../components/layouts/page/PageLayout";

export default function FindJobs() {

    const jobApi = new JobApi();

    const [jobs, setJobs] = useState([])

    const [pagingMeta, setPagingMeta] = useState({
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 1
    })

    const [filters, setFilters] = useState<{
        location?: {
            range?: number,
        },
        page?: number,
        [key: string]: any,

    }>({
        location: null,
        page: 1
    })
    const setFiltersByKeyValue = (key, value) => {
        setFilters({
            ...filters,
            page: 1,
            [key]: value
        })
    }

    const [location, setLocation] = useState(null);
    const [range, setRange] = useState(filters.location?.range || 50);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltersByKeyValue(name, value)
    }

    const fetchJobs = async () => {
        const { items, meta } = await jobApi.search({ ...filters as any });
        setJobs(items)
        setPagingMeta(meta)
    }

    useEffectAsync(fetchJobs, [ filters ]);

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
                },
                method: {
                    handleChange,
                    handlePaging: setPagingMeta,
                    setFilters,
                    setLocation,
                    setrange: setRange,
                    setFiltersByKeyValue,
                    applyFilters: fetchJobs
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
