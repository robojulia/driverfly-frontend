export default function Category () {
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
                <div className="topping">
                  <input type="checkbox" id="classcdl" name="classcdl" value="Paneer" />Class A CDL(30)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}