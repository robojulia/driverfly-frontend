import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../../public/dashboard/assets/images/bg/bg4.jpg";



export default function AccountSettings() {
    return (
        <>

            <div>

                <Row>
                    <h1>Account Settings</h1>
                </Row>
                <div className='container-fluid'>
                    <div className="modal-header border-0">
                    </div>
                    <form className="modal-body">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <label>Company Name</label>
                                <input name="name" type="text" className="form-control" placeholder=" Company Name" />

                            </div>
                            <div className="col-lg-6 col-12">
                                <label>Email</label>
                                <input name="email" type="text" className="form-control" placeholder="Email" />

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Address</label>
                                <input type="text" name="address" className="form-control" placeholder="Address" />

                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>City</label>
                                <input type="text" name="city" className="form-control" placeholder="City" />

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>State</label>
                                <input type="text" name="state" className="form-control" placeholder="State" />

                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Postal Code</label>
                                <input type="number" name="code" className="form-control" placeholder="Postal Code" />

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>About Company</label>
                                <textarea name="about" className="form-control" placeholder="About"></textarea>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Company Location</label>
                                <input type="text" name="location" className="form-control" placeholder="Company Location" />
                            </div>
                        </div>

                        <div className="modal-footer border-0 mt-5">
                            <button type="submit" className="btn btn-primary w-25 m-auto p-lg-3 p-5">Save</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
};

AccountSettings.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
