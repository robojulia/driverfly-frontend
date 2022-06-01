import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useTranslation } from '../../../../hooks/useTranslation';
import JobApi from '../../../api/job';
import { useEffect, useState } from 'react';
import jobsContext from "../../../../context/jobContext"
import Search from "../../../../components/filters/search";
import { Filter } from "react-bootstrap-icons";
import Sort from "../../../../components/find-jobs/sort";
import Category from "../../../../components/filters/category";
import Range from "../../../../components/filters/location/range";
import AreasCovered from "../../../../components/filters/areas-covered";
import EmploymentType from "../../../../components/filters/employment-type";
import TypeOfDelivery from "../../../../components/filters/type-of-delivery";
import Equipment from "../../../../components/filters/equipment";
import Schedule from "../../../../components/filters/schedule";
import PayStructure from "../../../../components/filters/pay-structure";
import SpecialEndorsementsRequired from "../../../../components/filters/special-endorsements-required";
import MvrRequirement from "../../../../components/filters/mvr-requirements";
import PostedDate from '../../../../components/filters/date-posted'
import JobsList from "../../../../components/find-jobs/job-list";
import ResultCount from "../../../../components/find-jobs/result-count"
import Filters from "../../../../components/dashboard/driver/find-job/filters";
export default function FindJobs() {

    const { t } = useTranslation();

    const { authDriver } = useRedirect();
    authDriver()

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltersByKeyValue(name, value)
    }

    const fetchJobs = async () => {
        try {
            const { items, meta } = await jobApi.search({ ...filters })
            setJobs(items)
            setPagingMeta(meta)
        } catch (e) {
            // console.error('exception is here: ', e);
            throw e
        }
    }

    useEffect(fetchJobs, [filters])
    useEffect(async () => {
        await fetchJobs()
    }, [])

    return (
        <jobsContext.Provider value={{
            state: {
                jobs,
                pagingMeta,
                filters,
            },
            method: {
                handleChange,
                setPagingMeta,
                setFilters,
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
