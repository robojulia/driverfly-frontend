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
    hasNextPage: false,
    hasPreviousPage: false,
    page: 0,
    pageCount: 1,
  })

  const [filters, setFilters] = useState({
    keywords: "",
    category: "",
    location: "",
    work_type: "",
    job_type: "",
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
    page: 0,
  })

  const router = useRouter()

  const searchByLocation = e => {
    e.preventDefault()
    console.log(e.target.location.value)
  }

  const sortHandler = e => {
    e.preventDefault()
    console.log(e.target.value)
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
    const { data, ...meta } = await axios.get(`${process.env.BASE_URL_API}/jobs`, {
      params: {
        ...filters,
      }
    }).then(res => res.data)
    setJobs(data)
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
                Showing
                <span className="first">
                  1
                </span> 
                – <span className="last">{jobs.length}</span>
                of {pagingMeta.itemCount} results
              </div>

              <div className="filter-btn-groups mt-3">
                <span className="text-secondary w-sm-25">Sort by:
                  <select onChange={sortHandler} className="custom-select shadow-none mt-lg-0 mt-md-3">
                    <option>Default</option>
                    <option value="1">Newest</option>
                    <option value="2">Oldest</option>
                    <option value="3">Random</option>
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
