import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Table } from "react-bootstrap";
import Head from 'next/head';
import schoolContext from "../context/school-context"
import { PublicLayout } from "../components/layouts/public-layout";
import FilterSchools from '../components/filter-schools/filter-schools'
import CdlInfo from '../components/cdl-info/cdlInfo'
import SchoolApi from "./api/school"
import { useTranslation } from "../hooks/use-translation";

export default function FindSchools(props) {

  const { t } = useTranslation();

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

  const currentPageIndex = parseInt(pagingMeta.currentPage)
  const previousPageIndex = currentPageIndex - 1
  const nextPageIndex = currentPageIndex + 1

  const handlePaging = async (page) => {
    await setFilters({
      ...filters,
      page: parseInt(page)
    })
  }

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

    if (valueSetter && valueSetter != prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }

  const setFiltersForQuery = async () => {
    Object.keys(params).map(key => {
      let inputs = document.getElementsByName(key);
      if (inputs[0].tagName.toLowerCase() != "input") {
        return
      }
      if (inputs[0].type.toLowerCase() == "text") {
        setNativeValue(inputs[0], params[key]);
      }
      if (inputs[0].type.toLowerCase() == "radio") {
        inputs.forEach(input => {
          if (input.value == params[key]) {
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

  const handleClick = (data) => async () => {
    let link = 'https://form.jotform.com/212917100952046?';
    link += 'providerName=' + data.provider_name;
    link += '&providerPhone=' + data.phone;
    link += '&providerEmail=' + data.email;
    window.open(link);
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
        <title>
          {t("FIND_SCHOOL_META_TITLE")} </title>
        <meta
          name="description"
          content={t("FIND_SCHOOL_META_DESC")} key="desc"
        />
      </Head>
      <div className="top-links-sec">
        <div className="container">
          <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h1>{t("FIND_SCHOOLS")}</h1>
          </div>
        </div>
      </div>

      <div className="filter-sec">
        <div className="container">
          <div className="row">
            < CdlInfo />
            <div className="col-12 col-lg-3 lg-mt-0 mt-5">
              < FilterSchools />
            </div>
            <div className="col-md-9 outer pl-4 table-responsive">
              <div className="filter-outer mt-5">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Location Type</th>
                      <th>Enrollment Type</th>
                      <th>Provider Name</th>
                      <th>Location Name</th>
                      <th>Address</th>
                      <th>Training Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.length > 0 && schools.map((school, index) => (
                      <tr key={index} onClick={handleClick(school)}>
                        <td> {school.location_type} </td>
                        <td> {school.private_enrollment ? 'Yes' : 'No'} </td>
                        <td> {school.provider_name} </td>
                        <td> {school.location_name} </td>
                        <td> {school.address} </td>
                        <td> {school.training_type.join(", ")} </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {
                  pagingMeta.totalPages != 0 &&

                  <ul className="pagination">
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
                        <span className="page-numbers" role="button" >
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
                        <span className="page-numbers " role="button" >
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
    <PublicLayout title="find_school">
      {page}
    </PublicLayout>
  )
}
