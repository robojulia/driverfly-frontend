import Link from 'next/link'
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import timeSince from "../../utils/timeSince"

export default function JobsList() {

  const { state, method } = useContext(jobContext)
  const { jobs, pagingMeta, filters } = state
  const { setFilters, applyFilters } = method

  const currentPageIndex = parseInt(pagingMeta.currentPage)
  const previousPageIndex = currentPageIndex - 1
  const nextPageIndex = currentPageIndex + 1

  const handlePaging = async (page) => {
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
            <img className="d-flex mr-4 truck-img" src="driverfly-logo-square.png" alt="" />
            <div className="media-body">
              <h4 className="mt-0">{job.title}
                <span
                  className=""
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Tooltip on top">
                  {/* <i className="fa fa-star" aria-hidden="true"></i> */}
                </span>
              </h4>
              <div className="job-date-author">
                posted {timeSince(job.created_at)} ago {
                  job?.company?.name &&
                  <>
                    by <span className="employer text-theme " role='button'>
                      {job.company.name}
                    </span>
                  </>
                }
              </div>
              <div className="job-metas text-secondary text-secondary">
                <div className="job-location">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  {`${job.location?.street}, ${job.location?.city}, ${job.location?.state},`}
                  <i className="fa fa-usd mr-1 ml-4" aria-hidden="true"></i>{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} per week
                </div>
                <div className="job-location">
                  {/* <i className="fa fa-star-o" aria-hidden="true"></i> */}
                  <strong className="text-secondary">{job.description_short}</strong>
                </div>
              </div>

            </div>
            <Link href={`/jobs/${job.id}`}>
              <button type="button" className="btn btn-outline-danger">Browse Job</button>
            </Link>

          </div>
        ))}

        {
          pagingMeta.totalPages !== 0 &&

          <ul className="pagination ">
            {
              currentPageIndex > 1 &&
              <>
                <li onClick={() => { handlePaging(1) }}>
                  <span className="next page-numbers " role="button" >
                    First
                  </span>
                </li>
              </>
            }

            {
              currentPageIndex > 1 &&
              <li onClick={() => { handlePaging(previousPageIndex) }} >
                <span className="page-numbers " role="button" >
                  {previousPageIndex}
                </span>
              </li>
            }

            {
              <li >
                <span className="page-numbers current active" role="button" >
                  {currentPageIndex}
                </span>
              </li>
            }

            {
              currentPageIndex < pagingMeta.totalPages &&
              <li onClick={() => { handlePaging(nextPageIndex) }} >
                <span className="page-numbers " role="button" value={parseInt(pagingMeta.page) + 1}>
                  {nextPageIndex}
                </span>
              </li>
            }

            {
              nextPageIndex < pagingMeta.totalPages &&
              <li onClick={() => { handlePaging(pagingMeta.totalPages) }}>
                <span className="next page-numbers " role="button" >
                  Last
                </span>
              </li>
            }
          </ul>
        }
      </div>

    </>
  )
}

