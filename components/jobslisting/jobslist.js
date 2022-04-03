import Link from 'next/link'
import { useContext } from "react"
import jobContext from "../../context/jobContext"

export default function JobsList() {

  const { state, method } = useContext(jobContext)
  const { jobs, pagingMeta, filters } = state
  const { setFilters, applyFilters } = method

  const currentPageIndex = parseInt(pagingMeta.page)
  const previousPageIndex = currentPageIndex - 1
  const nextPageIndex = currentPageIndex + 1

  const currentPageLabel = parseInt(pagingMeta.page) + 1
  const previousPageLabel = currentPageLabel - 1
  const nextPageLabel = currentPageLabel + 1

  const handlePaging = async (page) => {
    console.log("clicked page", page)
    await setFilters({
      ...filters,
      page: parseInt(page)
    }, applyFilters())
  }

  return (
    <>
      <div className="filter-outer mt-5">
        {jobs.length > 0 && jobs.map(job => (
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
        ))}

        <ul className="pagination ">

          {
            currentPageIndex > 0 &&
            <>
              <li onClick={() => { handlePaging(0) }}>
                <span className="next page-numbers " role="button" >
                  First
                </span>
              </li>
            </>
          }

          {
            pagingMeta.hasPreviousPage &&
            <>
              <li onClick={() => { handlePaging(previousPageIndex) }}>
                <span className="next page-numbers " role="button" >
                  <i className="fa fa-long-arrow-left mr-2" aria-hidden="true"></i>
                  Previous
                </span>
              </li>
            </>
          }

          {
            currentPageIndex > 0 &&
            <li onClick={() => { handlePaging(previousPageIndex) }} >
              <span className="page-numbers " role="button" >
                {previousPageLabel}
              </span>
            </li>
          }

          {
            <li >
              <span className="page-numbers current active" role="button" >
                {currentPageLabel}
              </span>
            </li>
          }

          {
            currentPageIndex < pagingMeta.pageCount - 1 &&
            <li onClick={() => { handlePaging(nextPageIndex) }} >
              <span className="page-numbers " role="button" value={parseInt(pagingMeta.page) + 1}>
                {nextPageLabel}
              </span>
            </li>
          }

          {
            pagingMeta.hasNextPage &&
            <li onClick={() => { handlePaging(nextPageIndex) }}>
              <span className="next page-numbers " role="button" >
                Next
                <i className="fa fa-long-arrow-right ml-2" aria-hidden="true"></i>
              </span>
            </li>
          }

          {
            nextPageIndex < pagingMeta.pageCount &&
            <li onClick={() => { handlePaging(pagingMeta.pageCount - 1) }}>
              <span className="next page-numbers " role="button" >
                Last
              </span>
            </li>
          }
        </ul>
      </div>

    </>
  )
}

