import 'bootstrap/dist/css/bootstrap.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import FilterResult from '../components/filter-results/filter-results'
import JobsList from '../components/jobslisting/jobslist'
import Layout from "../components/layouts"
import jobsContext from "../context/jobContext"
import BaseApi from "./api/_baseApi"
import JobApi from "./api/job"
import Sort from "../components/find-jobs/sort"
import ResultCount from "../components/find-jobs/result-count"

export default function FindJobs(props) {

    let { params } = props

    const jobApi = new JobApi();
    const router = useRouter()
    const [jobs, setJobs] = useState([])
    const initialPagingMeta = {
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 1
    }
    const [pagingMeta, setPagingMeta] = useState(initialPagingMeta)
    const resetPagingMeta = () => setPagingMeta(initialPagingMeta)

    const [filters, setFilters] = useState({ ...params })
    const setFiltersByKeyValue = (key, value) => {
        setFilters({
            ...filters,
            page: 1,
            [key]: value
        })
    }
    const [location, setLocation] = useState(null);
    const [range, setRange] = useState(filters.location?.range || 50);

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
        Object.keys(params).map(key => {
            let inputs = document.getElementsByName(key);
            if (!inputs.length) {
                return
            }
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
        if (params.hasOwnProperty('long') && params.hasOwnProperty('lat')) {
            setFiltersByKeyValue("location", {
                "place_name": params.place_name,
                "lat": params.lat,
                "long": params.long,
                "range": params.range || 1500
            });
        }
        params = {}
    }

    const fetchJobs = async () => {
        try {
            navigator.geolocation.getCurrentPosition(function (position) {
                setFiltersByKeyValue("location", {
                    "lat": position.coords.latitude,
                    "long": position.coords.longitude,
                    "range": 1500
                });
            });

            await jobApi.search({ ...filters })
                .then(({ items, meta }) => {
                    console.log({ items, meta, filters });
                    setJobs(items)
                    setPagingMeta(meta)
                })
        } catch (e) {
            // console.error('exception is here: ', e);
            throw e
        }
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
                location,
                range,
            },
            method: {
                handleChange,
                setPagingMeta,
                setFilters,
                setLocation,
                setRange,
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
