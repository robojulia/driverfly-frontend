import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import React, { useState } from 'react'
import RangeSlider from 'react-bootstrap-range-slider'
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"


export default function Salary () {
  const ctx = useContext( jobContext )
  const [value, setValue] = useState( 18 )
  const router = useRouter()
  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'filter-salary-type', e.target.value )
    router.replace( a )
    ctx.applyFilters()
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
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="radio" id="monthly" name="salry" value="monthly" />Monthly
              </div>
              <div className="topping pt-2">
                <input type="radio" id="weekly" name="salry" value="weekly" />Weekly
              </div>
              <div className="topping pt-2">
                <input type="radio" id="daily" name="salry" value="daily" />Daily
              </div>
              <div className="topping pt-2">
                <input type="radio" id="hourly" name="salry" value="hourly" />Hourly
              </div>
              <div className="topping pt-2">
                <input type="radio" id="yearly" name="salry" value="yearly" />Yearly
              </div>
            </div>
            <RangeSlider
              value={value}
              min={18}
              max={95000}
              onChange={e => setValue( e.target.value )}

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