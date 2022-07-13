import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import JobApi from '../../../api/job';
import { useEffect, useState } from 'react';
import jobsContext from "../../../../context/jobContext"
import JobsList from "../../../../components/find-jobs/job-list";
import ResultCount from "../../../../components/find-jobs/result-count"
import Filters from "../../../../components/dashboard/driver/find-job/filters";
import OtrJobsList from "../../../../components/find-jobs/otr-job-list";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
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

    const [filters, setFilters] = useState({})
    const setFiltersByKeyValue = (key, value) => {
        setFilters({
            ...filters,
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
        await jobApi.search({ ...filters })
            .then(({ items, meta }) => {
                setJobs(items)
                setPagingMeta(meta)
            })
            .catch((e) => { console.error('exception is here: ', e.response) })
    }

    useEffect(fetchJobs, [filters])
    useEffect(async () => { await fetchJobs() }, [])

    return (
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
                setPagingMeta,
                setFilters,
                setLocation,
                setRange,
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
    )
};

FindJobs.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
