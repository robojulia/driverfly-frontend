import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import FilterResult from '../components/filter-results/filter-results'
import JobsList from '../components/jobslisting/jobslist'
import Layout from "../components/layouts"
import jobsContext from "../context/jobContext"

export default function FindJobs() {

  const [jobs, setJobs] = useState([])
  const [pagingMeta, setPagingMeta] = useState({
    currentPage: 1,
    itemCount: 0,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 1
  })

  const [filters, setFilters] = useState({
    keywords: "",
    category: "",
    location: "",
    work_type: "",
    job_type: "",
    salary_type: "",
    min_salary: 0,
    max_salary: 0,
    areas_covered: "",
    employment_type: "",
    delivery_type: "",
    drivers_from: "",
    equipment_type: "",
    schedule: "",
    pay_structure: "",
    pay_structure: "",
    endoresements_type: "",
    mvr_requirements: "",
    page: 1,
    order_by: "ASC",
  })

  const router = useRouter()

  const searchByLocation = e => {
    e.preventDefault()
    console.log(e.target.location.value)
  }

  const sortHandler = e => {
    setFilters({
      ...filters,
      order_by: e.target.value
    }, fetchJobs())
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters({
      ...filters,
      [name]: value
    }, fetchJobs())
  }

  const fetchJobs = async () => {
    console.log('filters Final', filters)
    console.log('pagingMeta Final', pagingMeta)
    const { items, meta } = await axios.get(`${process.env.BASE_URL_API}/jobs`, {
      params: {
        ...filters,
      }
    }).then(res => res.data)
    setJobs(items)
    setPagingMeta(meta)
  }

  useEffect(fetchJobs, [])

  return (
    <jobsContext.Provider value={{
      state: {
        jobs,
        pagingMeta,
        filters,
      },
      method: {
        handleChange,
        setPagingMeta,
        setFilters,
        applyFilters: fetchJobs
      },
    }}>
      <div className="filter-sec">
        <div className="container">
          <div className="row">
            < FilterResult />
            <div className="col-md-9 outer pl-4 ">
              {/* <h2>{data}</h2> */}

              <form onSubmit={searchByLocation}>
                <div className="filter-inner d-flex align-items-baseline pl-lg-3 mt-lg-2 ml-lg-3">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  <input name="location" type="text" className="form-control border-0 w-25" placeholder="Location" />
                  <span className="find-me"></span>
                  <button type="submit" className="btn btn-danger btn-lg br-0 ">Search</button>
                </div>
              </form>

              <div className="results-count mt-4 ">
                Showing <span className="first">
                  {((pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage) + 1}
                </span> – <span className="last">
                  {(((pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage) + pagingMeta.itemCount)}
                </span> of {pagingMeta.totalItems} results
              </div>

              <div className="filter-btn-groups mt-3">
                <span className="text-secondary w-sm-25">Sort by:
                  <select onChange={sortHandler} className="custom-select shadow-none mt-lg-0 mt-md-3">
                    <option value="">Default</option>
                    <option value="DESC">Newest</option>
                    <option value="ASC">Oldest</option>
                  </select>
                </span>
              </div>
              < JobsList />

            </div>
          </div>
        </div>
      </div>
    </jobsContext.Provider>
  )

}

FindJobs.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
