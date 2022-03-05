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
import ShowMoreEquipment from '../show-more-equipment/ShowMoreEquipment'
import SpecialAccommodations from '../special-accommodations/Special-Accommodations'
import SpecialEndorsementsRequired from '../special-endorsements-required/Special-Endorsements-Required'
import TypeOfDelivery from '../type-of-delivery/TypeOfDelivery'




export default function FilterResults () {





  return (
    <>
      <div className="col">
        <h5 className='font-weight-normal'>Filter Results</h5>
        <form >
          < Search />
          <div className="bs-example">
            <div className="tab-content">
              <div className="accordion bg-transparent" id="accordionExample">
                < Category />
                < Location />
                < JobType />
                < Salary />
                < PostedDate />
                < AreasCovered />
                < FullParty />
                < EmploymentType />
                < TypeOfDelivery />
                < AcceptingDriversFrom />
                < ShowMoreEquipment />
                < Schedule />
                < PayStructure />
                < MinimumAge />
                < SpecialAccommodations />
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