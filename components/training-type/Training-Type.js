import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import schoolContext from "../../context/schoolContext"
import { SchoolTrainingType } from "../../enums/schools/school-training-type.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"

export default function TrainingType() {

  const { state, method } = useContext(schoolContext)
  const { handleChange } = method

  return (

    <>
      <div className="card">
        <div className="card-header" id="headingFour">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseFour" aria-expanded="true"
              aria-controls="collapseFour">Training Type <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseFour" className="collapse show"
          aria-labelledby="headingFour" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={SchoolTrainingType}
                name="training_type"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
