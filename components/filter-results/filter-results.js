import React from 'react'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import AcceptingDriversFrom from '../accepting-drivers-from/AcceptingDriversFrom'
import AreasCovered from '../areascovered/AreasCovered'
import Category from '../category/Category'
import EmploymentType from '../employment-type/Employment-Type'
import FullParty from '../full-part/Time'
import JobType from '../jobtype/JobType'
import Location from '../location/Location'
import MinimumAge from '../minimum-age/Minimum-Age'
import MvrRequirement from '../mvr-requirements/MVR-Requirements'
import PayStructure from '../pay-structure/Pay-Structure'
import PostedDate from '../postedate/PostedDate'
import Salary from '../salary/salary'
import Schedule from '../schedule/Schedule'
import Search from '../search/search'
import Equipment from '../equipment/Equipment'
import SpecialAccommodations from '../special-accommodations/Special-Accommodations'
import SpecialEndorsementsRequired from '../special-endorsements-required/Special-Endorsements-Required'
import TypeOfDelivery from '../type-of-delivery/TypeOfDelivery'
import Range from "../location/Range"
import { useTranslation } from '../../hooks/useTranslation'



export default function FilterResults() {

  const { t } = useTranslation();

  return (
    <>
      <div className="filter_container">
        <h5 className='font-weight-normal'>{t('FILTER_RESULT')}</h5>
        <form >
          < Search />
          <div className="bs-example">
            <div className="tab-content">
              <div className="accordion bg-transparent" id="accordionExample">
                < Category />
                < Range />
                < PostedDate />
                < AreasCovered />
                < EmploymentType />
                < TypeOfDelivery />
                < Equipment />
                < Schedule />
                < PayStructure />
                < SpecialEndorsementsRequired />
                < MvrRequirement />
              </div>
            </div>
          </div>

        </form>
      </div >
    </>
  )
}