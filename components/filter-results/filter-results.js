import React, { useContext } from 'react'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import AreasCovered from '../filters/areas-covered'
import Category from '../filters/category'
import EmploymentType from '../filters/employment-type'
import MvrRequirement from '../filters/mvr-requirements'
import PayStructure from '../filters/pay-structure'
import PostedDate from '../filters/date-posted'
import Schedule from '../filters/schedule'
import Search from '../filters/search'
import Equipment from '../filters/equipment'
import SpecialEndorsementsRequired from '../filters/special-endorsements-required'
import TypeOfDelivery from '../filters/type-of-delivery'
import Range from "../filters/location/range"
import { useTranslation } from '../../hooks/useTranslation'
import jobContext from '../../context/jobContext'
import TransmissionType from '../filters/vehicle-transmission-type'



export default function FilterResults() {

  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)

  return (
    <>
      <div className="filter_container">
        <h5 className='font-weight-normal'>{t('FILTER_RESULT')}</h5>
        <form >
          < Search t={t} state={state} method={method} />
          <div className="bs-example">
            <div className="tab-content">
              <div className="accordion bg-transparent" id="accordionExample">
                < Category t={t} state={state} method={method} />
                < Range t={t} state={state} method={method} />
                < PostedDate t={t} state={state} method={method} />
                < AreasCovered t={t} state={state} method={method} />
                < EmploymentType t={t} state={state} method={method} />
                < TypeOfDelivery t={t} state={state} method={method} />
                < Equipment t={t} state={state} method={method} />
                <TransmissionType t={t} state={state} method={method} />
                < Schedule t={t} state={state} method={method} />
                < PayStructure t={t} state={state} method={method} />
                < SpecialEndorsementsRequired t={t} state={state} method={method} />
                < MvrRequirement t={t} state={state} method={method} />
              </div>
            </div>
          </div>

        </form>
      </div >
    </>
  )
}