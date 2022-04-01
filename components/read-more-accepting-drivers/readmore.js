import React, { useState } from "react"
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { accepting_drivers_from } from "../../enums/jobs/job-fields"

const ReadMore = ({ children }) => {
  const text = children
  const [isReadMore, setIsReadMore] = useState(true)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }
  return (
    <p className="text">
      {isReadMore ? text.slice(1) : text}
      <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? "Show More +" : " Show less -"}
      </span>
    </p>
  )
}

const Content = () => {
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  const enumArray = Object.values(accepting_drivers_from)
  const totalLength = enumArray.length
  const firstHalf = enumArray.splice(0, 4)
  const secondHalf = enumArray.splice(4, totalLength - 1)

  return (
    <div className="container p-0">
      <h2>
        <div className="App">
          <div class="topping pt-2">
            <input
              onChange={handleChange}
              type="radio"
              name="accepting_drivers_from"
              value="" /> All
          </div>
        </div>
        <ReadMore>

          <div className="App">
            {secondHalf.map((value) => {
              return (
                <>
                  <div class="topping pt-2">
                    <input
                      onChange={handleChange}
                      type="radio"
                      name="accepting_drivers_from"
                      value={value} /> {value}
                  </div>
                </>
              )
            })}
          </div>

          <div className="App">
            {firstHalf.map((value) => {
              return (
                <>
                  <div class="topping pt-2">
                    <input
                      onChange={handleChange}
                      type="radio"
                      name="accepting_drivers_from"
                      value={value} /> {value}
                  </div>
                </>
              )
            })}
          </div>


        </ReadMore>
      </h2>
    </div>
  )
}

export default Content