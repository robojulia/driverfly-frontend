import React, { useContext, useState } from 'react'
import AreasCovered from '../filters/areas-covered'
import EmploymentType from '../filters/employment-type'
import MvrRequirement from '../filters/mvr-requirements'
import PayStructure from '../filters/pay-structure'
import PostedDate from '../filters/date-posted'
import Schedule from '../filters/schedule'
import Equipment from '../filters/equipment'
import SpecialEndorsementsRequired from '../filters/special-endorsements-required'
import TypeOfDelivery from '../filters/type-of-delivery'
import Range from '../filters/location/range'
import Category from '../filters/category'
import { useTranslation } from '../../hooks/use-translation'
import JobContext from '../../context/job-context'
import Search from '../filters/search'
import { Row, Col, Offcanvas, Button } from 'react-bootstrap';
import Sort from '../find-jobs/sort'
import { Filter } from 'react-bootstrap-icons'
import TransmissionType from '../filters/vehicle-transmission-type'
import { EmbeddedFilterTypes } from '../../enums/embedded/embedded-filter-types.enum'

export default function EmbeddedFilters({ filterType }) {

    const { t } = useTranslation();
    const { state, method } = useContext(JobContext)

    const [showFilters, setShowFilters] = useState<boolean>(false);
    const handleCloseFilters = () => setShowFilters(false);
    const handleShowFilters = () => setShowFilters(true);

    const { setFiltersByKeyValue, handleReset } = method
    const { searchQuery } = state


    return (
        <>
            <Row>
                <Col md="3">
                    < Search state={state} method={method}
                        inputClassName="form-control shadow-sm p-4" labelClassName="text-secondary " />
                </Col>
                <Col md="3">
                    <div className="rbt mt-lg-0 mt-md-0 mt-3">
                        <Sort inputClassName="custom-select shadow-none mt-2" labelClassName="text-secondary" />
                    </div>
                </Col>
                <Col md="6" className='text-right'>
                    <Button onClick={handleShowFilters} className="mt-39 theme-primary-btn-outline">
                        <Filter /> {t('FILTERS')}
                    </Button>
                </Col>
                <Offcanvas
                    show={showFilters}
                    onHide={handleCloseFilters}
                    placement="end"
                    className="tab-content">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="px-3 mt-2">
                            {t('FILTER_RESULT')}
                        </Offcanvas.Title>
                        <Button
                            type='button'
                            onClick={handleReset}
                            className='theme-secondary-btn ml-4'>
                            {t("reset_all")}
                        </Button>

                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="accordion bg-transparent px-3" id="accordionExample">
                            < Category state={state} method={method} />
                            < PostedDate state={state} method={method} />
                            < Range state={state} method={method} />
                            {
                                filterType !== EmbeddedFilterTypes.TEAM_DRIVERS || filterType !== EmbeddedFilterTypes.OTR_JOBS &&
                                < AreasCovered state={state} method={method} />
                            }
                            < PayStructure state={state} method={method} />
                            < TypeOfDelivery state={state} method={method} />
                            {
                                filterType !== EmbeddedFilterTypes.OWNER_OPERATOR || filterType !== EmbeddedFilterTypes.NEW_HIRES &&
                                < EmploymentType state={state} method={method} />

                            }
                            < Equipment state={state} method={method} />
                            < TransmissionType state={state} method={method} />
                            < Schedule state={state} method={method} />
                            {
                                filterType !== EmbeddedFilterTypes.HEAVY_HAUL || filterType !== EmbeddedFilterTypes.OWNER_OPERATOR &&
                                < SpecialEndorsementsRequired state={state} method={method} />

                            }
                            < MvrRequirement state={state} method={method} />
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </Row>
        </>
    )
}