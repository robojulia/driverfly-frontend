import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useTranslation } from '../../../../hooks/useTranslation';
import JobApi from '../../../api/job';
import { useEffect, useState } from 'react';
import jobsContext from "../../../../context/jobContext"
import JobsList from '../../../../components/jobslisting/jobslist';
import Search from "../../../../components/search/search";
import { Filter } from "react-bootstrap-icons";
import Sort from "../../../../components/find-jobs/sort";
import Category from "../../../../components/category/Category";
import Range from "../../../../components/location/Range";
import AreasCovered from "../../../../components/areascovered/AreasCovered";
import EmploymentType from "../../../../components/employment-type/Employment-Type";
import TypeOfDelivery from "../../../../components/type-of-delivery/TypeOfDelivery";
import ShowMoreEquipment from "../../../../components/show-more-equipment/ShowMoreEquipment";
import Schedule from "../../../../components/schedule/Schedule";
import PayStructure from "../../../../components/pay-structure/Pay-Structure";
import SpecialEndorsementsRequired from "../../../../components/special-endorsements-required/Special-Endorsements-Required";
import MvrRequirement from "../../../../components/mvr-requirements/MVR-Requirements";
import PostedDate from '../../../../components/postedate/PostedDate'

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

    const [showFilters, setShowFilters] = useState(false);
    const handleCloseFilters = () => setShowFilters(false);
    const handleShowFilters = () => setShowFilters(true);

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
        const { items, meta } = await jobApi.search({ ...filters })
        setJobs(items)
        setPagingMeta(meta)
    }

    useEffect(fetchJobs, [filters])
    useEffect(async () => {
        try {
            await fetchJobs()
        } catch (e) {
            // console.error('exception is here: ', e);
            throw e
        }
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
                <Row>
                    <Col md="3">
                        < Search inputClassName="form-control shadow-sm p-4" labelClassName="text-secondary w-sm-25" />
                    </Col>
                    <Col md="3">
                        <div className="filter-btn-groups">
                            <Sort inputClassName="custom-select shadow-none mt-2" labelClassName="text-secondary w-sm-25" />
                        </div>
                    </Col>
                    <Col md="3">
                        <Button variant="primary" onClick={handleShowFilters} className="mt-39">
                            <Filter /> {t('FILTERS')}
                        </Button>
                    </Col>
                    <Offcanvas show={showFilters} onHide={handleCloseFilters} placement="end" className="tab-content">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title className="px-3">
                                {t('FILTER_RESULT')}
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <div className="accordion bg-transparent px-3" id="accordionExample">
                                < Category />
                                < Range />
                                < PostedDate />
                                < AreasCovered />
                                < EmploymentType />
                                < TypeOfDelivery />
                                < ShowMoreEquipment />
                                < Schedule />
                                < PayStructure />
                                < SpecialEndorsementsRequired />
                                < MvrRequirement />
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Row>
                <Row className='mt-5'>
                    <Col className='col-12 my-lg-0 my-4'>
                        <div className="results-count mt-4 ">
                            Showing {
                                pagingMeta.itemCount !== 0 &&
                                <>
                                    <span className="first">
                                        {((pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage) + 1}
                                    </span> – <span className="last">
                                        {(((pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage) + pagingMeta.itemCount)}
                                    </span> of
                                </>
                            } {pagingMeta.totalItems} results
                        </div>
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
