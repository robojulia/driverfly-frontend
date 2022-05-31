import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import FilterResult from '../components/filter-results/filter-results'
import JobsList from '../components/jobslisting/jobslist'
import Layout from "../components/layouts"
import jobsContext from "../context/jobContext"
import Location from "../components/location/Location"
import BaseApi from "./api/_baseApi"
import JobApi from "./api/job"
import { updateQueryStringParameter } from "../logics/utils"
import Sort from "../components/find-jobs/sort"
import ResultCount from "../components/find-jobs/result-count"

export default function FindJobs(props) {

  let { params } = props
  // const params = {}
  const jobApi = new JobApi();
  const baseApi = new BaseApi();

  const [jobs, setJobs] = useState([])
  const [pagingMeta, setPagingMeta] = useState({
    currentPage: 1,
    itemCount: 0,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 1
  })

  const [filters, setFilters] = useState({
    ...params
  })

  const setFiltersByKeyValue = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  const router = useRouter()

  const sortHandler = e => {
    const { name, value } = e.target;
    setFiltersByKeyValue("order_by", value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltersByKeyValue(name, value)
  }

  const setNativeValue = (element, value) => {
    if (!element) {
      return
    }
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }

  const setFiltersForQuery = async () => {
    // To DO - If user come from driver dashboard
    // if (params.jobs_for_driver) {
    //   await Promise.all([
    //     driverApi.getDriver("drivers")
    //       .catch(error => {
    //         console.error("unable to fetch driver info", error);
    //         throw error;
    //       }),
    //     driverApi.getPreferences()
    //       .catch(error => {
    //         console.error("unable to fetch driver preference info", error);
    //         throw error;
    //       })
    //   ])
    //     .then(values => {
    //       const [driver, preferences] = values;
    //       // console.log("preferences", preferences.find(item => (item.category == "MATCHING" && item.label == "TEAM_DRIVER")));
    //       console.log("driver", driver)
    //       console.log("preferences", preferences)

    //       if (driver.license_type) {
    //         document.getElementsByName("cdl_class").forEach(input => {
    //           if (input.type.toLowerCase() === "radio" && input.value === driver.license_type) {
    //             input.checked = true;
    //             setFiltersByKeyValue("cdl_class", driver.license_type)
    //           }
    //         })
    //       }

    //     })
    // }

    Object.keys(params).map(key => {
      let inputs = document.getElementsByName(key);
      if (inputs[0].tagName.toLowerCase() !== "input") {
        return
      }
      if (inputs[0].type.toLowerCase() === "text") {
        setNativeValue(inputs[0], params[key]);
      }
      if (inputs[0].type.toLowerCase() === "radio") {
        inputs.forEach(input => {
          if (input.value === params[key]) {
            input.checked = true;
          }
        })
      }
    })
    params = {}
  }

  const fetchJobs = async () => {
    const { items, meta } = await jobApi.search({ ...filters })
    setJobs(items)
    setPagingMeta(meta)
  }

  useEffect(fetchJobs, [filters])
  useEffect(async () => {
    try {
      await setFiltersForQuery()
      await router.replace('find-jobs', undefined, { shallow: true });
      await fetchJobs()
    } catch (e) {
      // console.error('exception is here: ', e);
      throw e
    }
  }, [])

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
        setFiltersByKeyValue,
        applyFilters: fetchJobs
      },
    }}>
      <div className="filter-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-3 lg-mt-0 mt-5">
              < FilterResult />
            </div>
            <div className="col-md-9 outer pl-4 ">

              {/* <Location /> */}

              <ResultCount />

              <div className="filter-btn-groups mt-3">
                <Sort />
              </div>
              < JobsList />

            </div>
          </div>
        </div>
      </div>
    </jobsContext.Provider>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      params: context.query
    }
  }
}

FindJobs.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
