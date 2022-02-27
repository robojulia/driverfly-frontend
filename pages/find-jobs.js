import Link from 'next/link';
import Layout from "../components/layouts";
import FilterResult from '../components/filter-results/filter-results'
import JobsList from '../components/jobslisting/jobslist'
import 'bootstrap/dist/css/bootstrap.css'; 
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

export default function FindJobs() {
   
    return (
        <>
            <div className="filter-sec">
                <div className="container">
                    <div className="row"> 
                      < FilterResult />

                        <div className="col-md-9 outer pl-4 ">

                            <form action="">
                                <div className="filter-inner d-flex align-items-baseline pl-lg-3 mt-lg-2 ml-lg-3">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                    <input type="text" className="form-control border-0 w-25" placeholder="Location"/>
                                    <span className="find-me"></span>
                                    <button type="submit" className="btn btn-danger btn-lg br-0 ">Search</button>
                                </div>
                            </form>

                            <div className="results-count mt-4 ">
                                Showing <span className="first">1</span> – <span className="last">10</span> of 32 results
                            </div>

                            <div className="filter-btn-groups mt-3">
                                <button type="button" className="btn btn-danger  "><i className="fa fa-envelope-o"
                                                                                  aria-hidden="true"></i> Get Jobs
                                    Alerts
                                </button>
                                <button type="button" className="btn btn-danger  "> Mass Job Apply</button>
                                <button type="button" className="btn btn-danger  "><i className="fa fa-wifi"
                                                                                  aria-hidden="true"></i>
                                    RSS Feed
                                </button>
                                <span className="text-secondary w-sm-25">Sort by:
                                          <select className="custom-select shadow-none mt-lg-0 mt-md-3">
                                            <option>Default</option>
                                            <option value="1">Newest</option>
                                            <option value="2">Oldest</option>
                                            <option value="3">Random</option>
                                          </select></span>

                            </div>
                        < JobsList />
                       
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

FindJobs.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}