import React, { useState, useEffect } from 'react'
import Head from "next/head";
import Layout from "../components/layouts";
import RangeSlider from 'react-bootstrap-range-slider';

import search from '../public/css/CdlSearch.module.css'
import axios from 'axios';

export default function CdlSearch()
{
    const allSchools = [
        {
            provider_name:"Careers World Wide",
            phone:"+1 303-732-4381",
            email:"NULL",
            website:"NULL",
            address:"45 S. Main St. Keenesburg, Colorado 80643",
            geo_coordinates:["-104.520302","40.10886"],
            location_type:"In-Person",
            location_name:"Careers World Wide",
            private_enroll_only:false,
            a_theory:true, a_range:true, a_road:true,
            b_theory:false, b_range:false,b_road:false,
            passenger_theory:false,passenger_range:false,passenger_road:false,
            school_bus_theory:false,school_bus_range:false,school_bus_road:false,
            haz_mat_theory:false,partner:false
        },
        {
            provider_name:"Careers World Wide",
            phone:"+1 303-732-4381",
            email:"NULL",
            website:"NULL",
            address:"45 S. Main St. Keenesburg, Colorado 80643",
            geo_coordinates:["-104.520302","40.10886"],
            location_type:"In-Person",
            location_name:"Careers World Wide",
            private_enroll_only:false,
            a_theory:true, a_range:true, a_road:true,
            b_theory:false, b_range:false,b_road:false,
            passenger_theory:false,passenger_range:false,passenger_road:false,
            school_bus_theory:false,school_bus_range:false,school_bus_road:false,
            haz_mat_theory:false,partner:false
        }
    ];

    const [searchTerms, setSearchTerms] = useState({
        locationZip: "",
        zipWorks: false,
        locationRadius: 200,
        trainingType: "all",
        locationType: "any",
        privEnrollOnly: false,
    });
    const [isLoading, setLoading] = useState(false);

    const [schools, setSchools] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(-1);
    const [selectedSchool, setSelectedSchool] = useState([]);

    const handleChange = ( event ) => {
        const { name, value } = event.target;
        const zipWorks = searchTerms.locationZip === 5 && !isNan(searchTerms.locationZip);

        setSearchTerms( preValue => {
            return {
                ...preValue,
                [name]: value,
                zipWorks: zipWorks
            }
        } );
    }

    const switchPartnerStatus = id => event => {
        event.preventDefault();
        updatePartnerStatus(id);
        //window.location.reload();
    }

    const changeHoveredRow = row => event => {
        event.preventDefault();
        setHoveredRow(row);
    }

    const convertZipToLongLat = async zip => {
        let coor = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+zip+".json?country=us&access_token=pk.eyJ1IjoicmVuZWVtMTIzIiwiYSI6ImNreTJkdjRqaDBrMDgydm9kbHhiNXdiMGYifQ.FC3Lrn2szWoMbpnmBC56yw")
        .then(res => res.json())
        .then(
            (result) => {
                return (result && result.features[0] ? result.features[0].center : [-1, -1])
            },
            (error) => {
                console.log(error)
                return [-1, -1]
            }
        )
        return coor
    }

    //copied from https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
    const getMilesBetweenCoor = (c1, c2) => {
        var R = 3958.8;
        var rlat1 = c1[1] * (Math.PI/180);
        var rlat2 = c2[1] * (Math.PI/180);
        var difflat = rlat2-rlat1;
        var difflon = (c2[0]-c1[0]) * (Math.PI/180);

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
        return d;
    }

    useEffect( async () => {
        setLoading(true);
        console.log(`${process.env.BASE_URL_API}/schools/${searchTerms.privEnrollOnly}`);
        await axios.get(`http://localhost:4000/schools/${searchTerms.privEnrollOnly}`)
            .then(data => {
                console.log(data);
            })
            .catch(function (error) {
                console.log(error);
            })
        // fetch(`http://localhost:4000/schools/${searchTerms.privEnrollOnly}`)
        //     .then((res) => console.log(typeof(res)))
        // .then((data) => {
        //     console.log(data)
        //     setSchools(data)
        //     setLoading(false)
        // });
    }, [searchTerms]);

    return (
        <>
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

        <div className="container mt-5 mb-5 p-lg-2 p-0">
        <div>
        <div className={search.input_div}>
        Zip
        <input
        className="form-control"
        name="locationZip"
        type="text"
        value={searchTerms.locationZip}
        onChange={handleChange}
        placeholder="Zip Code"/>
        </div>
        <div className={search.input_div}>
        Radius: {searchTerms.locationRadius}
        <RangeSlider
        name="locationRadius"
        min="100" max="1000" step="100"
        //disabled={!searchTerms.zipWorks}
        onChange={handleChange}
        />
        </div>
        <div className={search.input_div}>
        <label>
        Training Type:
        <select value={searchTerms.trainingType} name="trainingType" onChange={handleChange}>
        <option value="all">All</option>
        <option value="cdl-a">CDL A</option>
        <option value="cdl-b">CDL B</option>
        <option value="passenger">Passenger</option>
        <option value="school-bus">School Bus</option>
        <option value="haz-mat">Hazardous Materials</option>
        </select>
        </label>
        </div>
        <div className={search.input_div}>
        <label>
        Location Type:
        <select value={searchTerms.locationType} name="locationType" onChange={handleChange}>
        <option value="any">Any</option>
        <option value="in-person">In-Person</option>
        <option value="online">Online</option>
        <option value="traveling">Traveling</option>
        </select>
        </label>
        </div>
        <div className={search.input_div}>
        <label>
        Private Enrollment Only?
        <input
        type="checkbox"
        name="privEnrollOnly"
        value={searchTerms.privEnrollOnly}
        onChange={handleChange}/>
        </label>
        </div>
        </div>
        <div className={search.school_table}>
        <table>
        <tbody>
        <tr>
        <th>Location Type</th>
        <th>Private Enrollment Only</th>
        <th>Provider Name</th>
        <th>Location Name</th>
        <th>Address</th>
        <th>Class A</th>
        <th>Class B</th>
        <th>Passenger</th>
        <th>School Bus</th>
        <th>Hazardous Materials Theory</th>
        { /* don't show partner info to drivers */ }
        { /* <th>Partner Status</th>
            <th>Change Partner Status</th> */}
            </tr>
            {
                schools.map(function(object, i) {
                    let classA = [];
                    if (object["a_theory"]) classA.push("Theory");
                    if (object["a_range"]) classA.push("Range");
                    if (object["a_road"]) classA.push("Road");

                    let classB = [];
                    if (object["b_theory"]) classB.push("Theory");
                    if (object["b_range"]) classB.push("Range");
                    if (object["b_road"]) classB.push("Road");

                    let passenger = [];
                    if (object["passenger_theory"]) passenger.push("Theory");
                    if (object["passenger_range"]) passenger.push("Range");
                    if (object["passenger_road"]) passenger.push("Road");

                    let schoolBus = [];
                    if (object["school_bus_theory"]) schoolBus.push("Theory");
                    if (object["school_bus_range"]) schoolBus.push("Range");
                    if (object["school_bus_road"]) schoolBus.push("Road");
                    return  <tr
                    className={(hoveredRow === i) ? search.hovered_row : ""}
                    onMouseEnter={changeHoveredRow(i)}
                    onMouseLeave={changeHoveredRow("")}
                    >
                    <td> { object["location_type"]} </td>
                    <td> { object["private_enroll_only"] ? "Yes" : "No" } </td>
                    <td> { object["provider_name"] } </td>
                    <td> { object["location_name"] } </td>
                    <td> { object["address"] } </td>
                    <td> { classA.length > 0 ? classA.join(', ') : "N/A"} </td>
                    <td> { classB.length > 0 ? classB.join(', ') : "N/A" } </td>
                    <td> { passenger.length > 0 ? passenger.join(', ') : "N/A" } </td>
                    <td> { schoolBus.length > 0 ? schoolBus.join(', ') : "N/A" } </td>
                    <td> { object["haz_mat_theory"] ? "Yes" : "No" } </td>
                    {/*<td> { object["partner"] ? "Partner" : "Not Partner"} </td>
                    <td> <button onClick={switchPartnerStatus(object._id)}> Switch Status </button> </td>*/}
                    </tr>
                })
            }
            </tbody>
            </table>
            </div>
            </div>
            </>
        )
    }

    CdlSearch.getLayout = function getLayout(page) {
        return (
            <Layout>
            {page}
            </Layout>
        )
    }
