import { Container } from 'reactstrap';
import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css';





export default function MyApplication() {

    return (
        <>
            <div className={style.application_container}>

                <div>
                    <div className='container-fluid'>
                        <form className="modal-body" >
                            <h2>Account Settings</h2>
                            <div className="row">
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Name</label>
                                    <input name="name" type="text" className="form-control" placeholder="Name" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Drivers License Number:</label>
                                    <input name="driver_licence" type="text" className="form-control" placeholder="Drivers License Number:" />
                                </div>

                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Above 21?</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" value="No" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Phone</label>
                                    <input name="phone" type="text" className="form-control" placeholder="Phone" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Expiration Date:</label>
                                    <input name="exp_date" type="date" className="form-control" placeholder="Expiration Date:" />
                                </div>

                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Highest Degree:</label>
                                    <input type="text" name="high_degree" className="form-control" placeholder=" Highest Degree:" />

                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="E-mail" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>State Issued:</label>
                                    <input type="text" name="state" className="form-control" placeholder="State Issued:" />
                                </div>
                            </div>


                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Street:</label>
                                    <input type="text" className="form-control" name="street" placeholder="Street:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>CDL Class Type:</label>
                                    <input type="text" name="cdl_class" className="form-control" placeholder="CDL Class Type:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Emergency Contact:</label>
                                    <input type="text" name="emergency" className="form-control" placeholder="Emergency Contact:" />
                                </div>

                            </div>

                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>City:</label>
                                    <input type="text" className="form-control" name="city" placeholder="City:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Years of CDL Experience:</label>
                                    <input type="text" name="year_exp" className="form-control" placeholder="Years of CDL Experience:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Phone Number:</label>
                                    <input type="text" name="number" className="form-control" placeholder="Phone Number:" />
                                </div>

                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>State & Zip:</label>
                                    <input type="text" className="form-control" name="zip" placeholder="State & Zip:" />
                                </div>
                                <div className="col-lg-2 col-12 mt-3">
                                    <label>Equipment Experience</label>
                                    <input type="text" name="equ_type" className="form-control" placeholder="Equipment Experience" />
                                </div>
                                <div className="col-lg-2 col-12 mt-3">
                                    <span className={style.lable}>Years Experience</span>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>Years Experience</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Relationship</label>
                                    <input type="text" name="relationship" className="form-control" placeholder="Relationship" />
                                </div>

                            </div>
                            <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                                <button
                                    type="submit" className={`  ${style.update_btn}`} >

                                    Update
                                </button>
                            </div>




                        </form>
                    </div>


                    <div className='container-fluid'>
                        <form className="modal-body" >
                            <h2>Past Employment</h2>
                            <div className="row">
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Last Employer:</label>
                                    <input name="last_emp" type="text" className="form-control" placeholder="Last Employer:" />
                                </div>
                               
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Can I pass a drug test?</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" value="No" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Has any of your license, permit or privilege to operate a CMV ever been suspended or revoked? If so, please explain:</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" value="No" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Phone</label>
                                    <input name="phone" type="text" className="form-control" placeholder="Phone" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Expiration Date:</label>
                                    <input name="exp_date" type="date" className="form-control" placeholder="Expiration Date:" />
                                </div>

                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Highest Degree:</label>
                                    <input type="text" name="high_degree" className="form-control" placeholder=" Highest Degree:" />

                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="E-mail" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>State Issued:</label>
                                    <input type="text" name="state" className="form-control" placeholder="State Issued:" />
                                </div>
                            </div>


                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Street:</label>
                                    <input type="text" className="form-control" name="street" placeholder="Street:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>CDL Class Type:</label>
                                    <input type="text" name="cdl_class" className="form-control" placeholder="CDL Class Type:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Emergency Contact:</label>
                                    <input type="text" name="emergency" className="form-control" placeholder="Emergency Contact:" />
                                </div>

                            </div>

                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>City:</label>
                                    <input type="text" className="form-control" name="city" placeholder="City:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Years of CDL Experience:</label>
                                    <input type="text" name="year_exp" className="form-control" placeholder="Years of CDL Experience:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Phone Number:</label>
                                    <input type="text" name="number" className="form-control" placeholder="Phone Number:" />
                                </div>

                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>State & Zip:</label>
                                    <input type="text" className="form-control" name="zip" placeholder="State & Zip:" />
                                </div>
                                <div className="col-lg-2 col-12 mt-3">
                                    <label>Equipment Experience</label>
                                    <input type="text" name="equ_type" className="form-control" placeholder="Equipment Experience" />
                                </div>
                                <div className="col-lg-2 col-12 mt-3">
                                    <span className={style.lable}>Years Experience</span>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>Years Experience</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Relationship</label>
                                    <input type="text" name="relationship" className="form-control" placeholder="Relationship" />
                                </div>

                            </div> */}
                            <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                                <button
                                    type="submit" className={`  ${style.update_btn}`} >

                                    Update
                                </button>
                            </div>




                        </form>
                    </div>
                </div>
            </div>

        </>
    )
};


MyApplication.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
