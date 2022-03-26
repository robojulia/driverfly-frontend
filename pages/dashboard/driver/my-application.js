import { Container } from 'reactstrap'
import LogoutButton from '../../../components/buttons/Logout'
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css'
import BaseInput from "../../../components/BaseInput"
import { useFormik } from "formik"
import * as yup from "yup"






export default function MyApplication () {


  const acc_form = useFormik( {
    initialValues: {
      name: '',
      driver_licence: '',
      age_limit: '',
      phone: '',
      exp_date: '',
      high_degree: '',
      email: '',
      state: '',
      street: '',
      cdl_class: '',
      emergency_contact: '',
      city: '',
      cdl_exp: '',
      phoneNumber: '',
      zip: '',
      equipment_type: '',
      years_exp: '',
      relationship: '',
    },
    validationSchema: yup.object( {
      name: yup.string().required( 'Name is required' ),
      driver_licence: yup.string().required( 'Driver licence is required' ),
      phone: yup.string().required( 'Phone is required' ),
      exp_date: yup.string().required( 'Exp date is required' ),
      high_degree: yup.string().required( 'High degree is required' ),
      email: yup.string().required( 'Email is required' ).email( "Enter valid email" ),
      state: yup.string().required( 'State is required' ),
      street: yup.string().required( 'Street is required' ),
      cdl_class: yup.string().required( 'Cdl class is required' ),
      emergency_contact: yup.string().required( 'Emergency contact is required' ),
      city: yup.string().required( 'City is required' ),
      cdl_exp: yup.string().required( 'Cdl exp is required' ),
      phoneNumber: yup.string().required( 'Phone number is required' ),
      zip: yup.string().required( 'Zip is required' ),
      equipment_type: yup.string().required( 'Equipment type is required' ),
      years_exp: yup.string(),
      relationship: yup.string().required( 'Relationship is required' ),
    } ),
    onSubmit: values => {
      console.log( values )
    }
  } )

  return (
    <>
      <div className={style.application_container}>

        <div>
          <div className='container-fluid'>
            <form className="modal-body" onSubmit={acc_form.handleSubmit}>
              <h2>Account Settings</h2>
              <div className="row">
                {/* name */}
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Name:"
                  placeholder="Name"
                  name="name"
                  value={acc_form.values.name}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                  touched={acc_form.touched.name}
                  error={acc_form.errors.name}
                />
                {/* Drivers License */}
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Drivers License Number:"
                  placeholder="Drivers License Number"
                  name="driver_licence"
                  value={acc_form.values.driver_licence}
                  touched={acc_form.touched.driver_licence}
                  error={acc_form.errors.driver_licence}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                {/* age limit */}
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
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Phone:"
                  placeholder="Phone"
                  name="phone"
                  value={acc_form.values.phone}
                  touched={acc_form.touched.phone}
                  error={acc_form.errors.phone}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Expiration Date:"
                  placeholder="Expiration Date"
                  name="exp_date"
                  type="date"
                  value={acc_form.values.exp_date}
                  touched={acc_form.touched.exp_date}
                  error={acc_form.errors.exp_date}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Highest Degree:"
                  placeholder="Highest Degree"
                  name="high_degree"
                  value={acc_form.values.high_degree}
                  touched={acc_form.touched.high_degree}
                  error={acc_form.errors.high_degree}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
              </div>
              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Email:"
                  placeholder="Email"
                  name="email"
                  value={acc_form.values.email}
                  touched={acc_form.touched.email}
                  error={acc_form.errors.email}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="State Issued:"
                  placeholder="State Issued"
                  name="state"
                  value={acc_form.values.state}
                  touched={acc_form.touched.state}
                  error={acc_form.errors.state}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
              </div>


              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Street:"
                  placeholder="Street"
                  name="street"
                  value={acc_form.values.street}
                  touched={acc_form.touched.street}
                  error={acc_form.errors.street}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="CDL Class Type:"
                  placeholder="CDL Class Type"
                  name="cdl_class"
                  value={acc_form.values.cdl_class}
                  touched={acc_form.touched.cdl_class}
                  error={acc_form.errors.cdl_class}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Emergency Contact:"
                  placeholder="Emergency Contact"
                  name="emergency_contact"
                  value={acc_form.values.emergency_contact}
                  touched={acc_form.touched.emergency_contact}
                  error={acc_form.errors.emergency_contact}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />

              </div>

              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="City:"
                  placeholder="City"
                  name="city"
                  value={acc_form.values.city}
                  touched={acc_form.touched.city}
                  error={acc_form.errors.city}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Years of CDL Experience:"
                  placeholder="Years of CDL Experience"
                  name="cdl_exp"
                  type="number"
                  value={acc_form.values.cdl_exp}
                  touched={acc_form.touched.cdl_exp}
                  error={acc_form.errors.cdl_exp}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Phone Number:"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={acc_form.values.phoneNumber}
                  touched={acc_form.touched.phoneNumber}
                  error={acc_form.errors.phoneNumber}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
              </div>
              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="State and Zip:"
                  placeholder="State and Zip"
                  name="zip"
                  value={acc_form.values.zip}
                  touched={acc_form.touched.zip}
                  error={acc_form.errors.zip}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Equipment Type:"
                  placeholder="Equipment Type"
                  name="equipment_type"
                  value={acc_form.values.equipment_type}
                  touched={acc_form.touched.equipment_type}
                  error={acc_form.errors.equipment_type}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <div className="col-lg-2 col-12 mt-3">
                  <span className={style.lable}>Years Experience</span>
                  <select class="form-select" name="years_exp" aria-label="Default select example">
                    <option selected>Years Experience</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <BaseInput
                  className="col-lg-4 col-12"
                  label="Relationship:"
                  placeholder="Relationship"
                  name="relationship"
                  value={acc_form.values.relationship}
                  touched={acc_form.touched.relationship}
                  error={acc_form.errors.relationship}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
              </div>
              <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                <button type="submit" className={`  ${style.update_btn}`} >
                  Update
                </button>
              </div>




            </form>
          </div>
          <hr />

          <div className='container-fluid'>
            <form action=""></form>
            <div className="row">
              <div className="col-lg-4 col-12 mt-3">
                <h2>Past Employment</h2>
                {/* Last employer */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Last Employer:</label>
                  <input name="last_emp" type="text" className="form-control" placeholder="Last Employer:" />
                </div>
                {/* Date employed */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Date Employed:</label>
                  <div className="d-flex align-items-center">
                    <input name="sta_date" type="date" className="form-control" /> <h2 className="mx-2">to</h2>
                    <input name="sta_date" type="date" className="form-control" />
                  </div>
                </div>
                {/* position title */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Position Title:</label>
                  <input type="text" name="position_title" className="form-control" placeholder="Position Title:" />
                </div>
                {/* company address */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Company Address:</label>
                  <input type="text" name="company_address" className="form-control" placeholder="Company Address:" />
                </div>
                {/* company phone */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Company Phone:</label>
                  <input type="text" name="phone" className="form-control" placeholder="Company Phone:" />
                </div>
                {/* authorize */}
                <div className="col-lg-11 col-12 mt-3">
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
                {/* subject */}
                <div className="col-lg-11 col-12 mt-3">
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
                {/* designated */}
                <div className="col-lg-11 col-12 mt-3">
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

              </div>

              {/* Safety column */}
              <div className="col-lg-8 col-12 mt-3">
                <h2>Safety Background</h2>
                <div className="row">
                  {/* col-1 */}
                  <div className="col-lg-6 col-12">
                    {/* drug test */}
                    <div className="col-lg-11 col-12 mt-3">
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
                    {/* PUI */}
                    <div className="col-lg-11 col-12 mt-3">
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
                    {/* PUI Date */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Year(s) of Past DUI’s:</label>
                      <div className="d-flex align-items-center">
                        <input type="date" name="years_past_dui" className="form-control" />
                        <span className="mx-1"> - </span>
                        <input type="date" name="years_past_dui" className="form-control" />
                      </div>
                    </div>
                    {/* criminal history */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Criminal History in last 3 years?</label>
                      <input type="text" name="criminal_history" className="form-control" placeholder="Criminal History in last 3 years?" />
                    </div>
                    {/* accidents */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Accidents within the last 5 years:</label>
                      <input type="number" name="academy_year" className="form-control" placeholder="Accidents within the last 5 years:" />
                    </div>
                    {/* accident details */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Accidents details:</label>
                      <textarea class="form-control mt-4 " name="accident_detail" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                  </div>
                  {/* col-2 */}
                  <div className="col-lg-6 col-12">
                    {/* license */}
                    <div className="col-lg-11 col-12 mt-3">
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
                    {/* violation */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Do you have any violation on you PSP from previous three years? If so please explain:</label>
                      <div className="col-lg-6 col-12 mt-1 border-0">
                        <div class="form-check form-check-inline">
                          <label class="form-check-label">Yes</label>
                          <input class="form-check-input" type="checkbox" name="psp" value="Yes" />
                        </div>
                        <div class="form-check form-check-inline">
                          <label class="form-check-label" >No</label>
                          <input class="form-check-input" type="checkbox" name="psp" value="No" />
                        </div>
                      </div>
                    </div>
                    {/* 5 years tickets */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Have you had any tickets in the previous 5 years? If so, please explain:</label>
                      <textarea class="form-control" name="any_tickets" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    {/* refused */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Have you ever refused to be tested or had a positive drug/alcohol test? if so, explain here:</label>
                      <textarea class="form-control" name="refused" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                <button
                  type="submit" className={`  ${style.update_btn}`} >

                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
};


MyApplication.getLayout = function getLayout ( page ) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
