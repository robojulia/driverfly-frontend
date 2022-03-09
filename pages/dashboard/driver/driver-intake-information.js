import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row } from "reactstrap";
// import SalesChart from "../../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../../public/dashboard/assets/images/bg/bg4.jpg";


export default function DriverIntakeInfo() {
  return (
    <>

      <div>
  
        <Row>
          <h1>Information</h1>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body">
            <div className="row">
              <div className="col-lg-6 col-12">
                <label>*First Name</label>
                <input name="first_name" type="text" className="form-control" placeholder="First Name" />

              </div>
              <div className="col-lg-6 col-12">
                <label>*Last Name</label>
                <input name="last_name" type="text" className="form-control" placeholder="Last Name" />

              </div>
              <div className="col-12">
                <label>*Phone</label>
                <input o type="text" name="phone" className="form-control" placeholder="Phone" />

              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <label>*Email</label>
                <input type="email" name="email" className="form-control" placeholder="E-mail" />

              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <label>* Qualifications</label>
                <textarea name="qualifications" className="form-control" id="validationTextarea" placeholder="Qualifications"></textarea>

              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your CV</label>
                <input name="cv" type="file" className="form-control  " />

              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your Commercial Driver’s License</label>
                <input name="license" type="file" className="form-control" />

              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your Medical card</label>
                <input name="card" type="file" className="form-control " />

              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>* Years of CDL driving cdl_experience</label>
                <select name="cdl_experience" className="form-select" aria-label="Default select example">
                  <option selected>Select CDL Driving cdl_experience</option>
                  <option value="1">1-5 Months</option>
                  <option value="2">6-11 Months</option>
                  <option value="3">1 Year</option>
                  <option value="1">2 Years</option>
                  <option value="2">3 Years</option>
                  <option value="3">4 Years</option>
                  <option value="1">5+ Years</option>
                </select>

              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>* Number of moving violations in the last 3 years</label>
                <select name="voilations" className="form-select" aria-label="Default select example">
                  <option selected>Select One</option>
                  <option value="1">0</option>
                  <option value="2">1</option>
                  <option value="3">2</option>
                  <option value="1">3</option>
                  <option value="2">4</option>
                  <option value="3">5</option>
                  <option value="1">6</option>
                  <option value="2">7</option>d-flex align-items-center
                </select>

              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>* Can you pass a drug & alcohol test</label>
                <div className="form-check">
                  <input value='1' className="form-check-input" type="radio" name="drugTest" id="flexRadioDefault1" checked />
                  <label className="form-check-label" for="flexRadioDefault1">
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input value='0' className="form-check-input" type="radio" name="drugTest" id="flexRadioDefault2" />
                  <label className="form-check-label" for="flexRadioDefault2">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 mt-5">
              <button type="submit" className="btn btn-primary w-50 m-auto p-lg-3 p-5">Submit</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
};

DriverIntakeInfo.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
