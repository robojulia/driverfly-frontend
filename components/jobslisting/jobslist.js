import Link from 'next/link'
import { useRouter } from "next/router"
import axios from "axios"
import { useEffect, useState } from "react"

export default function JobsList () {
  const router = useRouter()
  const [jobs, setJobs] = useState( [] )
  useEffect( async () => {
    let str = ""
    for ( const key in router.query ) {
      // if str is empty, don't add & to the beginning
      if ( !str ) {
        str = `${key}=${router.query[key]}`
      } else {
        str += `&${key}=${router.query[key]}`
      }
    }
    console.log( str )
    const { data } = await axios.get( `${process.env.BASE_URL_API}/jobs?${str}` )
    setJobs( data )
  }, [] )
  return (
    <>
      <div className="filter-outer mt-5">
        {jobs.map( job => (
          <div key={job.id} className="media align-items-center shadow-sm">
            <label className="checkbox-inline" htmlFor="remember">
              <input type="checkbox" name="remember" id="remember" value="1" />

            </label>
            <img className="d-flex mr-4 truck-img" src="img/CTR-logo-cartoon.png" alt="" />
            <div className="media-body">
              <span className="urgent">URGENT</span>
              <h6>Solo</h6>
              <h4 className="mt-0">{job.title}<span className=""
                data-toggle="tooltip"
                data-placement="top"
                title="Tooltip on top"> <i
                  className="fa fa-star" aria-hidden="true"></i> </span></h4>
              <div className="job-date-author">
                posted 3 days ago
                by <a href="" className="employer text-theme">Custom Trucker Recruiting</a>
              </div>
              <div className="job-metas text-secondary text-secondary">
                <div className="job-location">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>{job.location}
                </div>
                <div className="job-location">
                  <i className="fa fa-star-o" aria-hidden="true"></i><strong
                    className="text-secondary">Accepting drivers from
                    anywhere in Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota,
                    Missouri, Nebraska, North Dakota, Ohio, South Dakota and
                    Wisconsin</strong>
                </div>
              </div>

            </div>
            <Link href="/jobs/1">
              <button type="button" className="btn btn-outline-danger">Browse Job</button>
            </Link>

          </div>
        ) )}

        <ul className="pagination ">
          <li>
            <span className="page-numbers current active">1</span>
          </li>
          <li>
            <a className="page-numbers" href="#">2</a>
          </li>
          <li>
            <a className="page-numbers" href="#">3</a>
          </li>
          <li>
            <a className="page-numbers" href="#">4</a>
          </li>
          <li>
            <a className="next page-numbers" href="#">Next <i
              className="fa fa-long-arrow-right ml-2" aria-hidden="true"></i></a>
          </li>
        </ul>
      </div>

    </>
  )
}