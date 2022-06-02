import React from 'react'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'

import TrainingType from '../training-type/Training-Type'
import LocationType from '../location-type/Location-Type'
import PrivateEnrollment from '../private-enrollment/Private-Enrollment'
import Range from "../school-location/Range"

export default function FilterSchools() {

  return (
    <>
      <div className="filter_container">
        <h5 className='font-weight-normal'>Filter Schools</h5>
        <form >
          <div className="bs-example">
            <div className="tab-content">
              <div className="accordion bg-transparent" id="accordionExample">
                < Range />
                < TrainingType />
                < LocationType />
                < PrivateEnrollment />
              </div>
            </div>
          </div>

        </form>
      </div >
    </>
  )
}
