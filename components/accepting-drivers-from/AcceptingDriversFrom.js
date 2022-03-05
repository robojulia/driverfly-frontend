import Read from '../read-more-accepting-drivers/readmore'
export default function AcceptingDriversFrom () {
  return (
    <>

      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseacceptdirver" aria-expanded="true"
              aria-controls="collapseacceptdirver">Accepting Drivers From... <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseacceptdirver" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <  Read />

          </div>
        </div>
      </div>
    </>
  )
}