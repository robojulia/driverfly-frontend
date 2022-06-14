import React from 'react'
import { StarFill, GeoAlt, CalendarDate, Cash, Star } from 'react-bootstrap-icons';
export default function CompanyJob() {
  return (
    <div>
      <div className="media  shadow-sm">
        <div className="media-body">

          <span className="urgent">URGENT</span>
          <h6>FUll Time(W2)</h6>
          <h4 className="mt-0 text-dark">CDL-A OTR Flatbed – No Flatbed Experience Required!  <StarFill color='#febe42' /><span className="d-block" data-toggle="tooltip"
            data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
          <div className="job-metas">
            <div className="job-location">
              <span className='text-muted align-middle'>
                <GeoAlt color="#C5C5C5" className='mr-2' /> Anywhere in the US</span>
              <span className='text-muted ml-5 align-middle'>
                <CalendarDate color="#C5C5C5" className='mr-2' /> November 19, 2021</span>
              <span className='text-muted d-block'>
                <Cash color="#C5C5C5" className='mr-2' /> $1,200 - $1,730 per week</span>
            </div>
            <div className='position-absolute top-50 end-0 translate-middle'>
              <div className='p-2 rounded-circle' style={{ border: '1px solid #2da2af' }} >
                <Star color='#2da2af' size={50} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}


