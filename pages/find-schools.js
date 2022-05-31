import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import schoolContext from "../context/schoolContext"
import { Container, Col, ProgressBar, Row, Table, ToastContainer, FormGroup, InputGroup } from "react-bootstrap";
import Head from "next/head";
import Layout from "../components/layouts";
import RangeSlider from 'react-bootstrap-range-slider';
import FilterSchools from '../components/filter-schools/filter-schools'
import SchoolApi from "./api/school"
import { useTranslation } from "../hooks/useTranslation";
import { useFormik } from "formik";
import { SchoolEntity } from "../models/school/school.entity";
import * as fileUtils from "../utils/file";
import { parseCSV } from "../utils/file";

import search from '../public/css/CdlSearch.module.css'
import axios from 'axios';

export default function FindSchools(props) {

    let { params } = props
    const schoolApi = new SchoolApi();

    const [schools, setSchools] = useState([]);
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
        console.log({
            ...filters,
            [key]: value
        })
    }

    const router = useRouter();

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

    const fetchSchools = async () => {
        const { items, meta } = await schoolApi.search({ ...filters })
        setSchools(items)
        setPagingMeta(meta)
    }

    useEffect(fetchSchools, [filters])
    useEffect(async () => {
      try {
        await setFiltersForQuery()
        await router.replace('find-schools', undefined, { shallow: true });
        await fetchSchools()
      } catch (e) {
        console.error('exception is here: ', e);
        throw e
      }
    }, [])

    return (
        <schoolContext.Provider value={{
            state: {
                schools,
                pagingMeta,
                filters
            },
            method: {
                handleChange,
                setPagingMeta,
                setFilters,
                applyFilters: fetchSchools
            },
        }}>
            <Head>
                <title>CDL Schools</title>
            </Head>

            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>CDL Schools</h2>
                        <ul className="d-flex">
                            <li><a href="index.html" className="nav-link text-dark px-0">Home <i className="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
                            <li><a href="#" className="nav-link text-dark px-0">CDL Schools</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="filter-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3 lg-mt-0 mt-5">
                            < FilterSchools />
                        </div>
                        <div className="col-md-9 outer pl-4 ">
                            <div className="filter-outer mt-5">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Location Type</th>
                                            <th>Private Enrollment Only</th>
                                            <th>Provider Name</th>
                                            <th>Location Name</th>
                                            <th>Location</th>
                                            <th>Training Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { schools.length > 0 && schools.map(school => (
                                            <tr>
                                                <td> { school.location_type } </td>
                                                <td> { school.private_enrollment ? 'Yes' : 'No' } </td>
                                                <td> { school.provider_name } </td>
                                                <td> { school.location_name } </td>
                                                <td> { school.location } </td>
                                                <td> { school.training_type } </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </schoolContext.Provider>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
          params: context.query
      }
    }
}

FindSchools.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
