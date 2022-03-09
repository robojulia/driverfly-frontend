import {
  Button, Card, CardBody, Col, Form,
  FormGroup, Input, Label, Row
} from 'reactstrap'
import FullLayout from "../../components/dashboard/layouts/FullLayout"
import { useFormik } from "formik"
import * as yup from "yup"
import axios from "axios"


export default function Profile () {
  const formik = useFormik( {
    initialValues: {
      first_name: "",
      last_name: "",
      contact_number: "",
      zip_code: "",
      state: "",
      address: "",
      country: "",
    },
    validationSchema: yup.object( {
      first_name: yup.string().required( "First name is required" ),
      last_name: yup.string().required( "Last name is required" ),
      contact_number: yup.string().required( "Contact number is required" ),
      address: yup.string().required( "Address is required" ),
      zip_code: yup.number().required( "Zip code is required" ),
      state: yup.string().required( "State is required" ),
      country: yup.string().required( "Country is required" ),
    } ),
    onSubmit: async(v) => {
      await axios.put(`${process.env.BASE_URL_API}/user/3`, {
        ...v
      } )
    }
  } )

  const handleReset = () => {
    console.log("handleReset");
  }

  return (
    <>
      <div>
        {/***Top Cards***/}
        <Row>
          <h1>Profile</h1>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit} onReset={handleReset}>
                  {/* firstname */}
                  <FormGroup>
                    <Label for="firstname">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Enter First Name"
                      onChange={formik.handleChange}
                      value={formik.values.first_name}
                      onBlur={formik.handleBlur}
                      type="text"
                    />
                    {formik.touched.first_name && formik.errors.first_name ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.first_name}</p> : null}
                  </FormGroup>
                  {/* lastname */}
                  <FormGroup>
                    <Label for="lastname">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Enter Last Name"
                      onChange={formik.handleChange}
                      value={formik.values.last_name}
                      onBlur={formik.handleBlur}
                      type="text"
                    />
                    {formik.touched.last_name && formik.errors.last_name ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.last_name}</p> : null}
                  </FormGroup>
                  {/* contact number */}
                  <FormGroup>
                    <Label for="contactNumber">Contact Number</Label>
                    <Input
                      id="contact_number"
                      onChange={formik.handleChange}
                      value={formik.values.contact_number}
                      onBlur={formik.handleBlur}
                      name="contact_number"
                      placeholder="Enter Contact Number"
                      type="text"
                    />
                    {formik.touched.contact_number && formik.errors.contact_number ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.contact_number}</p> : null}
                  </FormGroup>
                  {/* address */}
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <Input
                      id="address"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      onBlur={formik.handleBlur}
                      name="address"
                      placeholder="Enter Address"
                      type="text"
                    />
                    {formik.touched.address && formik.errors.address ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.address}</p> : null}
                  </FormGroup>
                  {/* state */}
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Enter State"
                      onChange={formik.handleChange}
                      value={formik.values.state}
                      onBlur={formik.handleBlur}
                      type="text"
                    />
                    {formik.touched.state && formik.errors.state ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.state}</p> : null}
                  </FormGroup>
                  {/* country */}
                  <FormGroup>
                    <Label for="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      onChange={formik.handleChange}
                      value={formik.values.country}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Country"
                      type="text"
                    />
                    {formik.touched.country && formik.errors.country ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.country}</p> : null}
                  </FormGroup>
                  {/* country */}
                  <FormGroup>
                    <Label for="zip_code">Zip Code</Label>
                    <Input
                      id="zip_code"
                      name="zip_code"
                      onChange={formik.handleChange}
                      value={formik.values.zip_code}
                      onBlur={formik.handleBlur}
                      placeholder="Enter Zip Code"
                      type="text"
                    />
                    {formik.touched.zip_code && formik.errors.zip_code ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.zip_code}</p> : null}
                  </FormGroup>
                  <Button type="submit">Submit</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    </>
  )
};

Profile.getLayout = function getLayout ( page ) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
