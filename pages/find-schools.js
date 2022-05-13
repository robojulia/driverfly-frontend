import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import schoolContext from "../context/schoolContext"
import Head from "next/head";
import Layout from "../components/layouts";
import RangeSlider from 'react-bootstrap-range-slider';
import FilterSchools from '../components/filter-schools/filter-schools'
import SchoolApi from "./api/school"
import { useTranslation } from "../hooks/useTranslation";
import { useFormik } from "formik";
import * as yup from "yup";
import { SchoolEntity } from "../models/school/school.entity";

import search from '../public/css/CdlSearch.module.css'
import axios from 'axios';

export default function FindSchools(props) {

    let { params } = props
    const schoolApi = new SchoolApi();
    const schema = SchoolEntity.yupSchema();

    const [schools, setSchools] = useState([]);
    const [filters, setFilters] = useState({
        ...params
    })

    const setFiltersByKeyValue = (key, value) => {
        setFilters({
            ...filters,
            [key]: value
        })
    }

    const { t } = useTranslation();
    const router = useRouter();

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
        console.log(filters);
        const { items, meta } = await schoolApi.search({ ...filters })
        setSchools(items)
    }

    const initialValues = [];

    const form = useFormik({
        initialValues: {
            items: initialValues
        },
        validationSchema: yup.object({
            items: yup
                .array(schema)
                .min(1, t("PLEASE_UPLOAD_A_FILE_WITH_AT_LEAST_ONE_ROW"))
                .unique(t("{name}_must_be_unique_in_list", { name: "EMAIL" }, { translateProps: true }), "email", v => v.email),
        }),
        validate: async (values) => {
            const errors = {};

            let lastProgress = 0;
            for (let i = 0; i < values.items.length; i++) {
                const applicant = values.items[i];

                if (applicant.email) {
                    const matches = await api.list({ email: applicant.email })

                    if (matches.some(v => v.company?.id != null)) errors[i] = { email: t("{name}_ALREADY_EXISTS", { name: "EMAIL" }, { translateProps: true }) };
                    else if (matches.some(v => v.company == null)) errors[i] = { email: t("{name}_ALREADY_EXISTS_NO_MERGE", { name: "EMAIL" }, { translateProps: true }) };

                }

                let progress = Math.floor((i + 1) * 100 / values.items.length);

                if (progress != lastProgress) {
                    setProgress(progress);
                    lastProgress = progress;
                }
            }

            setProgress(100);
            setWarnings(errors);
        },
        onSubmit: async (values) => {

            let lastProgress = 0;

            for (let i = 0; i < values.items.length; i++) {
                let dto = values.items[i];

                try {
                    await api.create(dto);
                }
                catch (e) {
                    console.log("error saving applicant", i, e);
                    form.setFieldError(`items.${i}.id`, t("UNABLE_TO_SAVE"));
                    toast.error(t("unable_to_save_information"))
                    return;
                }

                let progress = Math.floor((i + 1) * 100 / values.items.length);

                if (progress != lastProgress) {
                    setProgress(progress);
                    lastProgress = progress;
                }
            }

            toast.success(t("successfully_saved_information"));

            setTimeout(onClearClick, 2000);
        }
    });


    const [ progress, setProgress ] = useState(0);

    const [ fileName, setFileName ] = useState("");

    const canUpload = !fileName && !form.isValidating && !form.isSubmitting;
    const canImport = form.isValid && !form.isValidating && !form.isSubmitting && form.values.items.length > 0;
    const canClear = (form.values.items.length > 0 || fileName) && !form.isValidating && !form.isSubmitting;

    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const onFileChange = async (e) => {
        const { target: { files: [ file ], value } } = e;
        setFileName(value);

        if (file) {
            let contents = await fileUtils.readCSV(file, {
                onProgress: (p) => setProgress(p)
            });
            // contents = parseCSV(contents);
            // if (contents.length <= 1) {
            //     toast.error("FILE_HAS_NO_RECORDS");
            //     return;
            // }

            // headers = contents[0];

            if (contents.length > 0 && contents[0][0] === headers[0]) contents = contents.slice(1);

            contents = contents.map(row => {
                const entity = new ApplicantEntity();

                row.forEach((col, i) => {
                    const header = headers[i];

                    const desc = schemaDescribe.fields[header];
                    if (col) {
                        switch (desc.type) {
                            case "boolean": entity[header] = col === "Y"; break;
                            default: entity[header] = col;
                        }
                    }
            });

                return entity;
            });

            form.setValues({ items: contents }, true);
        }
    }

    const onDownloadClick = (e) => {
        FileDownload(headers.join(","), "Import Applicants Template.csv");
    }

    const onClearClick = (e) => {
        form.resetForm();
        setFileName("");
        setProgress(0);
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
            filters
          },
          method: {
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
                        <InputGroup>
                            <div className="input-group-prepend">
                                <button type="button" onClick={onDownloadClick} className="btn btn-md btn-primary pl-3">{t("DOWNLOAD_TEMPLATE")}</button>
                            </div>
                            <input onChange={onFileChange} disabled={!canUpload} className="form-control" type="file" accept=".csv" value={fileName} id="formFile" />
                            {
                                !!fileName &&
                                <div class="input-group-append">
                                    <button type="button" disabled={!canClear} onClick={onClearClick} className="btn btn-md btn-danger">{t("CLEAR")}</button>
                                </div>
                            }
                        </InputGroup>
                            < FilterSchools />
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
