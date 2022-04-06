import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import React, { useState } from 'react'
import RangeSlider from 'react-bootstrap-range-slider'
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { salary_type } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from '../enum-filters/enum-filter-by-key-value'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function Salary() {

  const { state, method } = useContext(jobContext)
  const { handleChange, setFilters, applyFilters } = method
  const { filters } = state

  const [minValue, maxValue] = [1, 95000]

  const rangeValue = {
    min: minValue,
    max: maxValue,
  }

  const [displayValue, setDisplayValue] = useState({
    min: minValue,
    max: maxValue,
  })

  const handleSliderChange = ([min, max]) => {
    setDisplayValue({
      min: min,
      max: max
    })
  }

  const handleAfterSliderChange = ([min, max]) => {
    setFilters({
      ...filters,
      min_salary: min,
      max_salary: max,
    }, applyFilters())
  }

  const handleChangeSalary = async (e) => {
    await handleAfterSliderChange([displayValue.min, displayValue.max])
    await handleChange(e)
  }

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
                handleChange={handleChangeSalary}
              />
            </div>

            {
              filters.salary_type &&
              <>
                <Slider
                  range
                  min={rangeValue.min}
                  max={rangeValue.max}
                  step={1}
                  onChange={handleSliderChange}
                  onAfterChange={handleAfterSliderChange}
                  defaultValue={[displayValue.min, displayValue.max]}
                  allowCross={false}
                  pushable
                  draggableTrack
                />
                {/* <Range /> */}
                <div className='row'>
                  <div className='col'>
                    ${displayValue.min}
                  </div>
                  <div className='col text-right'>
                    ${displayValue.max}
                  </div>
                </div>
              </>
            }


          </div>
        </div>
      </div>
    </>
  )
}