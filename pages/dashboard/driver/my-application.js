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
                                            <input class="form-check-input" type="checkbox" name="age_limit" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="age_limit" value="No" />
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
                                    <input type="email" name="email" className="form-control" placeholder="E-mail" />
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
                                    <select class="form-select" name="year_exp" aria-label="Default select example">
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
                                            <input class="form-check-input" type="checkbox" name="drug_test" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="drug_test" value="No" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Has any of your license, permit or privilege to operate a CMV ever been suspended or revoked? If so, please explain:</label>
                                    <div className="col-lg-6 col-12 mt-1 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" name="any_licence" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="any_licence" value="No" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Start Date:</label>
                                    <input name="sta_date" type="date" className="form-control" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>End Date:</label>
                                    <input name="end_date" type="date" className="form-control" />
                                </div>

                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Past DUI’s:</label>
                                    <div className="col-lg-6 col-12 mt-3 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" name="past_dui" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="past_dui" value="No" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Position Title:</label>
                                    <input type="text" name="position_title" className="form-control" placeholder="Position Title:" />
                                </div>
                                <div className="col-lg-3 col-12 mt-3">
                                    <label>Year(s) of Past DUI’s:</label>
                                    <input type="date" name="years_past_dui" className="form-control" />
                                </div>
                                <div className="col-lg-1 col-12 mt-5 text-center">
                                    <p>To</p>
                                </div>
                                <div className="col-lg-3 col-12 mt-3">
                                    <label></label>
                                    <input type="date" name="years_past_dui" className="form-control" />
                                </div>
                            </div>


                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Do you have any violations on your PSP from previous three years ? If so, please explain:</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" name="any_violation" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="any_violation" value="No" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Company Phone:</label>
                                    <input type="text" name="phone" className="form-control" placeholder="Company Phone:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Criminal History in last 3 years?</label>
                                    <input type="text" name="criminal_history" className="form-control" placeholder="Criminal History in last 3 years?" />
                                </div>

                            </div>

                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Do you authorize prospective employers to contact this company?</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" name="prospectice_contact" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="prospectice_contact" value="No" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Accidents within the last 5 years:</label>
                                    <input type="text" name="academy_year" className="form-control" placeholder="Accidents within the last 5 years:" />
                                </div>
                                <div className="col-lg-4 col-12 mt-3">
                                    <label>Were you subject to the FMCSRs?</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" name="fmcsr" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="fmcsr" value="No" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <row className='row'>
                            <div className="col-lg-4 col-12 mt-3">
                                    <label>Was your job designated as a safety-sensitive function in any DOT- regulated mode subject to the drug and alcohol testing requirements of 49 CFR Part 40?</label>
                                    <div className="col-lg-6 col-12 mt-2 border-0">
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label">Yes</label>
                                            <input class="form-check-input" type="checkbox" name="safety_sensitive" value="Yes" />
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <label class="form-check-label" >No</label>
                                            <input class="form-check-input" type="checkbox" name="safety_sensitive" value="No" />
                                        </div>
                                    </div>
                                </div>


                            </row>
                            <div className='row'>
                                <div className="col-lg-4 col-12 mt-3">

                                    <label for="exampleFormControlTextarea1" class="form-label">Have you had any tickets in the previous 5 years? If so, please explain:</label>
                                    <textarea class="form-control" name="any_tickets" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <div className="col-lg-4 col-12 mt-3">

                                    <label for="exampleFormControlTextarea1" class="form-label">Accidents details:</label>
                                    <textarea class="form-control mt-4 " name="accident_detail" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>

                               
                                <div className="col-lg-4 col-12 mt-3">

                                    <label for="exampleFormControlTextarea1" class="form-label">Have you ever refused to be tested or had a positive drug/alcohol test? if so, explain here:</label>
                                    <textarea class="form-control" name="refused" id="exampleFormControlTextarea1" rows="3"></textarea>
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
