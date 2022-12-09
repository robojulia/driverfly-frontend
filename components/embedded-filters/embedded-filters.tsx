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
import TransmissionType from '../filters/vehicle-transmission-type'
import { EmbeddedFilterTypes } from '../../enums/embedded/embedded-filter-types.enum'
import TeamDrivers from '../filters/team-driver'
import MinimumYearsExperience from '../filters/minimum-years-experience'

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

            <div className="filter_container">
                <div className='d-flex'>
                    <h5 className='font-weight-normal mt-2'>{t('FILTER_RESULT')}</h5>
                    <button
                        type='button'
                        onClick={handleReset}
                        className='theme-secondary-btn ml-4'>
                        {t("reset_all")}
                    </button>
                </div>
                <form >
                    < Search state={state} method={method} />
                    <div className="bs-example">
                        <div className="tab-content">
                            <div className="accordion bg-transparent" id="accordionExample">
                                < Category state={state} method={method} />
                                < PostedDate state={state} method={method} />
                                < Range state={state} method={method} />
                                {
                                    filterType !== EmbeddedFilterTypes.TEAM_DRIVERS || filterType !== EmbeddedFilterTypes.OTR_JOBS &&
                                    <>
                                        < AreasCovered state={state} method={method} />
                                        < TypeOfDelivery state={state} method={method} />
                                    </>
                                }
                                < PayStructure state={state} method={method} />

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
                                < TeamDrivers state={state} method={method} />
                                <MinimumYearsExperience state={state} method={method} />
                            </div>
                        </div>
                    </div>

                </form>
            </div >
        </>
    )
}