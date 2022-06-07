import { useState } from "react";
import { GeoAlt, Search } from "react-bootstrap-icons";
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum"

export default function HeroSearch(props) {

    const { t, router } = props

    const [filters, setFilters] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        router.push({
            pathname: "find-jobs",
            query: { ...filters },
        });
    };

    const searchHandler = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="hero-search">
            <div className="input-group border-0">
                <div className="input-group-prepend">
                    <Search color="#C5C5C5" />
                </div>
                <input
                    onKeyPress={searchHandler}
                    onChange={handleChange}
                    name="keywords"
                    type="text"
                    className="mx-3"
                    placeholder={t('SEARCH_KEYWORD')}
                    aria-label=""
                    aria-describedby="basic-addon1"
                />
            </div>
            {/* <div className="input-group">
                <div className="input-group-prepend">
                    <GeoAlt color="#C5C5C5" />
                </div>

                <input
                    onKeyPress={searchHandler}
                    type="text"
                    className="mx-3"
                    placeholder="Location"
                    aria-label=""
                    aria-describedby="basic-addon1"
                />
            </div> */}
            <select
                name="employment_type"
                onChange={handleChange}
                className="form-select custom-sel"
                aria-label="Default select example"
                id="exampleFormControlSelect1"
            >
                <option className="selectbg">{t('WORK_TYPE')}</option>
                {Object.values(JobEmploymentType).map((value, index) => {
                    return (
                        <option key={index} value={value}>
                            {t('JobEmploymentType.' + value)}
                        </option>
                    );
                })}
            </select>
            <select
                name="cdl_class"
                onChange={handleChange}
                className="form-select custom-sel "
                aria-label="Default select example"
                id="exampleFormControlSelect1"
            >
                <option>{t('CDL_CLASS_TYPE')}</option>
                {Object.values(DriverLicenseType).map((value, index) => {
                    return (
                        <option key={index} value={value}>
                            {t('DriverLicenseType.' + value)}
                        </option>
                    );
                })}
            </select>
            <div className="form-group form-group-search m-0">
                <button
                    onClick={handleSubmit}
                    className="btn-submit btn btn-block btn-theme hvr-shrink"
                    type="button"
                >
                    {t('SEARCH')}
                </button>
            </div>
        </div>
    )
}