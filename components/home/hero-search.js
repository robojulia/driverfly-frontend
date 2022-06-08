import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GeoAlt, Search } from "react-bootstrap-icons";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum"
import { useTranslation } from "../../hooks/useTranslation";
import MapboxApi from "../../pages/api/mapbox";

export default function HeroSearch(props) {

    const router = useRouter();
    const { t } = useTranslation();

    const [filters, setFilters] = useState({});
    const mapboxApi = new MapboxApi()

    const [range, setRange] = useState(50);
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

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

    const handleKeywordSearch = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleTypeheadSearch = async (query) => {
        try {
            if (query) {
                setIsLoading(true);
                const results = await mapboxApi.forwardGeocoding(query)
                setOptions(results?.features || []);
                setIsLoading(false);
            } else {
                setLocation(null)
            }
        } catch (error) {
            console.error("exception.......", error);
        }
    };

    const handleTypeheadChange = () => {
        let val = null
        if (location) {
            val = {
                ...filters,
                place_name: location.place_name,
                long: location.geometry.coordinates[0],
                lat: location.geometry.coordinates[1],
                range: 1500
            }
        }
        setFilters(val);
    }

    useEffect(handleTypeheadChange, [location])

    return (
        <div className="hero-search">
            <div className="input-group border-0">
                <div className="input-group-prepend">
                    <Search color="#C5C5C5" />
                </div>
                <input
                    onKeyPress={handleKeywordSearch}
                    onChange={handleChange}
                    name="keywords"
                    type="text"
                    className="mx-3"
                    placeholder={t('SEARCH_KEYWORD')}
                    aria-label=""
                    aria-describedby="basic-addon1"
                />
            </div>

            <div className="input-group">
                {/* <div className="input-group-prepend">
                    <GeoAlt color="#C5C5C5" />
                </div> */}
                <AsyncTypeahead
                    id="async-example"
                    name="location"
                    isLoading={isLoading}
                    labelKey="place_name"
                    minLength={1}
                    onChange={value => setLocation(value[0])}
                    onSearch={handleTypeheadSearch}
                    onInputChange={handleTypeheadSearch}
                    options={options}
                    placeholder="Location"
                    renderMenuItemChildren={(option, props) => (
                        <>
                            <span className='text-dark'>{option.place_name}</span>
                        </>
                    )}
                />
            </div>
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