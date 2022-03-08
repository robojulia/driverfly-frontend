import LogoutButton from '../../components/buttons/Logout';
import FullLayout from "../../components/dashboard/layouts/FullLayout";
import { Col, Row } from "reactstrap";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../public/dashboard/assets/images/bg/bg4.jpg";


export default function PrestoresDocuments() {
  return (
    <>

      <div>
        {/***Top Cards***/}
        <Row>
          <h1>Prestored Document</h1>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body">
            {/* <div>{inputValues}</div> */}
            <div className="row">
              {/* First Name */}
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
              <div className="col col-12 mt-3">
                <label>Upload your Medical card</label>
                <input name="card" type="file" className="form-control " />

              </div>
           
            </div>


            <div className="modal-footer border-0 mt-5">
              <button type="submit" className="btn btn-primary w-25 m-auto p-lg-3 p-5">Submit</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
};

PrestoresDocuments.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
