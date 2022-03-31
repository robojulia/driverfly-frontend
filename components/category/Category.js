import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { cdl_classes } from "../../enums/jobs/cdl-classes"

export default function Category() {

  const { filters, applyFilters } = useContext(jobContext)
  const categoryFilter = (e) => {
    if (e.target.checked) {
      filters.category = e.target.value
      applyFilters()
    }
  }

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
                <div class="topping ">
                  <input
                    onChange={categoryFilter}
                    type="radio"
                    name="category"
                    value="" />
                  Any
                </div>
                {Object.keys(cdl_classes).map((key) => {
                  return (
                    <>
                      <div class="topping pt-2">
                        <input
                          onChange={categoryFilter}
                          type="radio"
                          name="category"
                          value={key} />
                        {cdl_classes[key]}
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}