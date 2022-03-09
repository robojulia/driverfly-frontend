import {
  Button, Card, CardBody, Col, Form,
  FormGroup, Input, Label, Row
} from 'reactstrap'
import FullLayout from "../../components/dashboard/layouts/FullLayout"
import { useFormik } from "formik"
import * as yup from "yup"


export default function Profile () {
  const formik = useFormik( {
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      contact_number: "",
      state: "",
      country: "",
    },
    validationSchema: yup.object( {
      email: yup.string().email( "Invalid email address" ).required( "Email is required" ),
      first_name: yup.string().required( "First name is required" ),
      last_name: yup.string().required( "Last name is required" ),
      contact_number: yup.string().optional( "Contact number is required" ),
      state: yup.string().optional( "State is required" ),
      country: yup.string().optional( "Country is required" ),
    } ),
    onSubmit: v => {
      console.log( v )
    }
  } )

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
                <Form onSubmit={formik.handleSubmit}>
                  {/* email */}
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      type="text"
                    />
                    {formik.touched.email && formik.errors.email ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.email}</p> : null}
                  </FormGroup>
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
