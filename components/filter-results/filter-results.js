import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import React, { useState } from 'react'
import RangeSlider from 'react-bootstrap-range-slider'
import Search from '../search/search'
import Category from '../category/Category'
import Location from '../location/Location'
import JobType from '../jobtype/JobType'
import Salary from '../salary/salary'
import PostedDate from '../postedate/PostedDate'
import AreasCovered from '../areascovered/AreasCovered'
import FullParty from '../full-part/Time'
import EmploymentType from '../employment-type/Employment-Type'
import TypeOfDelivery from '../type-of-delivery/TypeOfDelivery'
import AcceptingDriversFrom from '../accepting-drivers-from/AcceptingDriversFrom'
import ShowMoreEquipment from '../show-more-equipment/ShowMoreEquipment'
import Schedule from '../schedule/Schedule'
import PayStructure from '../pay-structure/Pay-Structure'
import MinimumAge from '../minimum-age/Minimum-Age'
import SpecialAccommodations from '../special-accommodations/Special-Accommodations'
import SpecialEndorsementsRequired from '../special-endorsements-required/Special-Endorsements-Required'
import MvrRequirement from '../mvr-requirements/MVR-Requirements'




export default function FilterResults () {

  return (
    <>
      <div className="col">
        <h5 className='font-weight-normal'>Filter Results</h5>
        <form action="">
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