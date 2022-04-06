import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { cdl_classes } from "../../enums/jobs/cdl-classes"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"

export default function Category() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card mt-3">
        <div className="card-header" id="headingOne">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseOne" aria-expanded="true"
              aria-controls="collapseOne">Category <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne"
          data-parent="#accordionExample">
          <div className="card-body">
            <div className="custom-control custom-checkbox p-0">
              <div className="App">
              <EnumFilterByKeyValue
                withAll={true}
                enumArray={cdl_classes}
                name="category"
                handleChange={handleChange}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}