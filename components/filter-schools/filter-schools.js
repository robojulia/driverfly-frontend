import React, { useContext } from 'react'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'

import TrainingType from '../school-filters/Training-Type'
import LocationType from '../school-filters/Location-Type'
import PrivateEnrollment from '../school-filters/Private-Enrollment'
import Range from "../school-filters/Range"
import schoolContext from '../../context/schoolContext'

export default function FilterSchools() {

  const { state, method } = useContext(schoolContext)

  return (
    <>
      <div className="filter_container">
        <h5 className='font-weight-normal'>Filter Schools</h5>
        <form >
          <div className="bs-example">
            <div className="tab-content">
              <div className="accordion bg-transparent" id="accordionExample">
                < Range state={state} method={method} />
                < TrainingType state={state} method={method} />
                < LocationType state={state} method={method} />
                < PrivateEnrollment state={state} method={method} />
              </div>
            </div>
          </div>

        </form>
      </div >
    </>
  )
}
