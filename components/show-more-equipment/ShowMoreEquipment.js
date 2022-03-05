import Read from '../equipment-show-more/readmore'
export default function ShowMoreEquipment () {
  return (
    <>

      <div className="card">
        <div className="card-header" id="headingsee">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseseemore" aria-expanded="true"
              aria-controls="collapseseemore">Equipment Type<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseseemore" className="collapse show"
          aria-labelledby="headingsee" data-parent="#accordionExample">
          <div className="card-body">
            < Read />
          </div>
        </div>
      </div>
    </>
  )
}