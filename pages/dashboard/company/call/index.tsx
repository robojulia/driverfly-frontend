import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useRedirect from '../../../../hooks/useRedirect';
import { useEffect, useState } from 'react';
import CallApi from "../../../api/call"
import ApplicantApi from "../../../api/applicant"
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import ViewDataTable from "../../../../components/viewDetails/viewDataTable";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import { useEffectAsync } from "../../../../utils/react";
import { TelephoneFill } from "react-bootstrap-icons";
import { useTranslation } from "../../../../hooks/useTranslation";

export default function Call() {

    const { authCompany } = useRedirect()
    authCompany()
    const { t } = useTranslation()

    const applicantApi = new ApplicantApi()
    const [applicants, setApplicants] = useState<ApplicantEntity[]>([])


    const [device, setDevice] = useState(null)
    const [identity, setIdentity] = useState('+923214604331')
    const [status, setStatus] = useState("Disconnected")
    const [ready, setReady] = useState(false)

    const connect = () => {
        const params = {
            // 'To': identity,
            'PhoneNumber': identity,
            // 'call_type': 'voice',
            'call_mode': 'WEB',
        };

        try {
            device.connect(params)
        } catch (error) {
            console.error("connection error", error.message)
        }
    }

    const disconnect = () => { device.disconnectAll() }

    const createDevice = async (token) => {
        console.log("token", token);

        const Device = (await import('twilio-client')).Device
        const deviceClient = new Device(token, { debug: true, appName: 'driverfly' })

        deviceClient.on("ready", (device) => {
            console.log("Twilio.Device Ready!");
            setStatus("Device ready");
            setReady(true);
        });

        deviceClient.on("error", (error) => {
            console.log("Twilio.Device Error: " + error.message);
            setStatus("ERROR: " + error.message);
        });

        deviceClient.on("connect", (conn) => {
            console.log("Successfully established call!");

            // If phoneNumber is part of the connection, this is a call from a
            // support agent to a customer's phone
            if ("phoneNumber" in conn.message) {
                setStatus("In call with " + conn.message.phoneNumber);
            } else {
                // This is a call from a website user to a support agent
                setStatus("In call with support");
            }
        });

        deviceClient.on("disconnect", (conn) => {
            // Disable the hangup button and enable the call buttons

            setStatus("Ready");
        });

        deviceClient.on("incoming", (conn) => {
            setStatus("Incoming support call");

            // Set a callback to be executed when the connection is accepted
            conn.accept(function () {
                setStatus("In call with customer");
            });

            // Set a callback on the answer button and enable it
            // answerButton.click(function () {
            //     conn.accept();
            // });
            // answerButton.prop("disabled", false);
        });

        setDevice(deviceClient);

    }

    const handleTokenGenerate = async () => {
        const callApi = new CallApi()
        callApi.generateToken()
            .then(async ({ token }) => {
                await createDevice(token)
                    .catch(error => console.error("creating device error....", error))
            })
    }

    const openCallDialog = (phoneNumber) => { }

    useEffectAsync(async () => {
        await applicantApi.list()
            .then(data => { console.log("applicantApi", data); setApplicants(data); })
            .catch(error => console.error("applicantApi.list error....", error))

    }, [])

    return (
        <>
            <button
                onClick={handleTokenGenerate}
                className='btn btn-primary m-2'>
                Connect
            </button>
            <div>
                <h4>Status: {status}</h4>
                <h4>Number: {identity}</h4>
                {
                    ready &&
                    <>
                        <input
                            className='form-control m-2'
                            value={identity}
                            onChange={(e) => setIdentity(e.target.value)}
                            type="text"
                            placeholder="Enter Number" />

                        <button
                            className='btn btn-primary m-2'
                            onClick={connect}
                        >
                            Press to Talk
                        </button>
                        <button
                            className='btn btn-primary m-2'
                            onClick={disconnect}
                        >
                            Press to End
                        </button>
                    </>
                }
            </div>


            <Row className="mt-5">
                <Col lg="12 ">
                    <ViewDataTable
                        columns={[
                            {
                                name: "name",
                                selector: applicant => `${applicant.first_name} ${applicant.last_name}`,
                            },
                            {
                                name: "email",
                                selector: applicant => applicant.email,
                                hidable: false
                            },
                            {
                                name: "phone",
                                selector: applicant => applicant.phone,
                            },
                        ]}
                        actions={applicant => ([
                            {
                                onClick: e => openCallDialog(applicant.phone),
                                label: (<><TelephoneFill />  {t("MAKE_CALL")}</>)
                            },
                        ])}
                        items={applicants}
                    />
                </Col>
            </Row>

        </>
    )
};

Call.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}