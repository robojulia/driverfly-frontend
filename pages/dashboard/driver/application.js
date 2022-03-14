import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../../public/dashboard/assets/images/bg/bg4.jpg";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';
import { useEffect, useState } from "react"
import axios from "axios"





export default function Application({ jobs }) {

    const { authDriver } = useRedirect();

    authDriver()

    function timeSince ( date ) {

        var seconds = Math.floor( ( new Date() - date ) / 1000 )
    
        var interval = seconds / 31536000
    
        if ( interval > 1 ) {
          return Math.floor( interval ) + " years"
        }
        interval = seconds / 2592000
        if ( interval > 1 ) {
          return Math.floor( interval ) + " months"
        }
        interval = seconds / 86400
        if ( interval > 1 ) {
          return Math.floor( interval ) + " days"
        }
        interval = seconds / 3600
        if ( interval > 1 ) {
          return Math.floor( interval ) + " hours"
        }
        interval = seconds / 60
        if ( interval > 1 ) {
          return Math.floor( interval ) + " minutes"
        }
        return Math.floor( seconds ) + " seconds"
      }

      return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h1>Application</h1>
                </Row>
                {/***Sales & Feed***/}

            </div>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody className="">
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Post Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.length > 0 && jobs.map((job, index) => (
                                        <tr>
                                            <th scope="row">{index+1}</th>
                                            <td>{job.title}</td>
                                            <td>{timeSince( new Date( job.created_at ) )}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

Application.getInitialProps = async () => {

    const res = await fetch(`${process.env.BASE_URL_API}/jobs`)
    const json = await res.json()
    return { jobs: json }
}

Application.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
