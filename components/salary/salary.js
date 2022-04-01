import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import React, { useState } from 'react'
import RangeSlider from 'react-bootstrap-range-slider'
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { salary_type } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from '../enum-filters/enum-filter-by-key-value'

export default function Salary() {

  const [value, setValue] = useState(18)

  const { state, method } = useContext(jobContext)
  const { handleChange } = method


  return (
    <>
      <div className="card">
        <div className="card-header" id="headingFive">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseFive" aria-expanded="true"
              aria-controls="collapseFive">Salary <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseFive" className="collapse show"
          aria-labelledby="headingFive" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
            <EnumFilterByKeyValue
                withAll={true}
                enumArray={salary_type}
                name="salary_type"
                handleChange={handleChange}
              />
            </div>
            <RangeSlider
              value={value}
              min={18}
              max={95000}
              onChange={e => setValue(e.target.value)}

              variant='info'
            />

            <div className='row'>
              <div className='col'>
                ${value}
              </div>
              <div className='col text-right'>
                95000
              </div>
            </div>


          </div>
        </div>
      </div>
    </>
  )
}