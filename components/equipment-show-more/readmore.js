import React, { useState } from "react"
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum"
import { useTranslation } from "../../hooks/useTranslation";

const ReadMore = ({ children }) => {
  const text = children
  const [isReadMore, setIsReadMore] = useState(true)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }
  return (
    <div className="text">
      {isReadMore ? text.slice(0, 1) : text}
      <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? "Show More +" : " Show less -"}
      </span>
    </div>
  )
}

const Content = () => {
  const { state, method } = useContext(jobContext)
  const { filters } = state
  const { handleChange } = method
  const { t } = useTranslation();

  const enumArray = Object.values(JobEquipmentType)
  const totalLength = enumArray.length
  const firstHalf = enumArray.splice(0, 4)
  const secondHalf = enumArray.splice(4, totalLength - 1)

  return (
    <div className="container p-0">
      <h2>
        <div className="App">
          <div className="topping pt-2">
            <input
              defaultChecked={(!filters.equipment_type) || (filters.equipment_type == "")}
              onChange={handleChange}
              type="radio"
              name="equipment_type"
              value="" /> All
          </div>
        </div>
        <ReadMore>

          <div className="App">
            {firstHalf.map((value, index) => {
              return (
                <div key={index} className="topping pt-2">
                  <input
                    defaultChecked={filters.equipment_type !== undefined && filters.equipment_type == value}
                    onChange={handleChange}
                    type="radio"
                    name="equipment_type"
                    value={value} /> {t(value.toLowerCase())}
                </div>
              )
            })}
          </div>

          <div className="App">
            {secondHalf.map((value, index) => {
              return (
                <div key={index} className="topping pt-2">
                  <input
                    defaultChecked={filters.equipment_type !== undefined && filters.equipment_type == value}
                    onChange={handleChange}
                    type="radio"
                    name="equipment_type"
                    value={value} /> {t(value.toLowerCase())}
                </div>
              )
            })}
          </div>


        </ReadMore>
      </h2>
    </div>
  )
}

export default Content