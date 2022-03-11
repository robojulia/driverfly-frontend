import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import download from "../../../public/dashboard/assets/images/download/download.png";
import Applicant from "../../../public/dashboard/styles/css/Applicants.module.css"
import Link from 'next/link';
import Image from 'next/image';
import useRedirect from '../../../hooks/useRedirect';



export default function Dashboard() {

    const { authCompany } = useRedirect();

    authCompany()

    return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h1>Applicants</h1>
                </Row>
                <div className='applicants__section'>
                    <Row className='scrollbar scrollbar-primary'>
                        <Col lg="12" className='force-overflow p-0  '>
                            <Card>
                                <CardBody className={Applicant.applicanttable}>

                                    <Table bordered striped >
                                        <thead className={Applicant.tablheader}>
                                            <tr>
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Description</th>
                                                <th>Jon(s) Applied To</th>
                                                <th>Date(s) Applied</th>
                                                <th>Meets basic qualifications(?)</th>
                                                <th>Status</th>
                                                <th>Source</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta, GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta, GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta, GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta,Applicant GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta, GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta, GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                            <tr>
                                                <td>Rego Atkins</td>
                                                <td>(404)432-8900</td>
                                                <td>test@gmail.com</td>
                                                <td>Atlanta, GA</td>
                                                <td>Solo CDL-A OTR – No Touch Freight, Live Load/Unload  Urgent</td>
                                                <td>11/23/2021</td>
                                                <td>Yes</td>
                                                <td>Interviewed</td>
                                                <td>Referral-Paul Atkins</td>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="Change Status"></input>
                                                    </td>
                                                </Link>
                                                <Link href="" passHref>
                                                    <td>  <input className={Applicant.change_status_btn}
                                                        type="button"
                                                        value="View details                                                    "></input>
                                                    </td>
                                                </Link>
                                            </tr>
                                        </tbody>
                                    </Table>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
            <Row className={Applicant.applicant_detail_sec}>
                <Col></Col>
                <Col>
                    <Row className='mt-5'>
                        <Col sm="6" lg="10">
                            <div className={Applicant.header}>
                                <p>Checklist Items</p>
                            </div>
                            <div className={Applicant.body}>

                            </div>
                        </Col>
                        <Col sm="6" lg="2">
                            <Image
                                src={download}
                                alt="Download"
                                className="rounded-circle"
                                width="30"
                                height="30"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
};

Dashboard.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
