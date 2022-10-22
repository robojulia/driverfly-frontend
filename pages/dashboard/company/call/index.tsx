import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import { Col, Row } from "reactstrap";
import { useEffect, useState } from 'react';
import TwilioApi from "../../../api/twilio"
import ApplicantApi from "../../../api/applicant"
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import ViewDataTable from "../../../../components/view-details/view-data-table";
import { useEffectAsync } from "../../../../utils/react";
import { TelephoneFill, TelephoneMinusFill, TelephoneOutboundFill, TelephonePlus, TelephonePlusFill, XCircleFill } from "react-bootstrap-icons";
import { useTranslation } from "../../../../hooks/use-translation";
import { Container, Modal } from "react-bootstrap";
import { toast } from 'react-toastify'
import Spinner from 'react-bootstrap/Spinner'
import ViewMissedCalls from "../../../../components/call/view-missed-calls";

export default function Call() {

    const { t } = useTranslation()

    const applicantApi = new ApplicantApi()
    const twilioApi = new TwilioApi()

    const [callingId, setCallingId] = useState(null)
    const [applicants, setApplicants] = useState<ApplicantEntity[]>([])
    const [device, setDevice] = useState(null)
    const [identity, setIdentity] = useState<ApplicantEntity>({})
    const [status, setStatus] = useState("Disconnected")
    const [ready, setReady] = useState(false)
    const [connected, setConnected] = useState(false)
    const [loading, setloading] = useState(true)

    const [showCaller, setShowCaller] = useState(false)
    const handleShowCaller = () => setShowCaller(true)
    const handleHideCaller = () => {
        disconnectCall()
        setShowCaller(false)
        setReady(false);
    }

    useEffectAsync(async () => {

        await twilioApi.getPhoneNumber()
            .then(({ value }) => setCallingId(value || null))
            .catch(error => toast.error(t(error?.response?.data?.message || "NO_TWILIO_NUMBER_AVAILABLE")))

        await applicantApi.list()
            .then(data => {
                setloading(false)
                setApplicants(data)
            })
            .catch(error => console.error("applicantApi.list error....", error.response));
    }, [])

    const setupTwilio = async () => {
        if (!!callingId) {
            twilioApi.generateToken()
                .then(async ({ token }) => {
                    await setupClient(token)
                        .catch(error => console.error("creating device error....", error))
                })
        } else {
            toast.error(t("NO_TWILIO_NUMBER_AVAILABLE"))
        }
    }

    const setupClient = async (token) => {
        try {
            const Device = (await import('twilio-client')).Device
            const client = new Device(token, { debug: true, appName: process.env.TWILIO_APP_NAME || 'driverfly' })

            client.on("ready", (device) => {
                setConnected(false)
                setStatus("Ready to call");
                setReady(true);
            });

            client.on("error", (error) => {
                console.log("Twilio.Device Error: " + error.message);
                setStatus("ERROR: " + error.message);
            });

            client.on("connect", (conn) => {
                setConnected(true)
                setStatus("Calling")
                // if ("PhoneNumber" in conn.message) {
                //     setStatus("In call with " + conn.message.PhoneNumber);
                // }
            });

            client.on("disconnect", (conn) => {
                setConnected(false)
                setStatus("Ready to call");
            });

            client.on("incoming", (conn) => {
                setStatus("Incoming support call");

                conn.accept(function () {
                    setStatus("In call with user");
                });
            });

            setDevice(client);
        } catch (error) {

        }
    }

    const connectCall = () => {
        setConnected(true)
        if (identity?.phone) device.connect({
            'PhoneNumber': formatPhoneNumber(identity.phone),
            'from': callingId,
        })
    }

    const disconnectCall = () => {
        setConnected(false)
        device.disconnectAll()
    }

    const openCallDialog = async (applicant) => {
        setloading(true)
        await setupTwilio()
        setIdentity(applicant)
    }

    useEffectAsync(async () => {
        if (!!ready) {
            handleShowCaller()
            setloading(false)
        } else {
            toast.error(t('COULD_NOT_MAKE_CALL'))
        }
    }, [ready])

    const formatPhoneNumber = (phoneNumberString) => (`+${('' + phoneNumberString).replace(/\D/g, '')}`)

    return (
        <>
            {!!loading && <Spinner animation="grow" variant="info" />}

            <Row className="">
                <Col lg="12 ">
                    <ViewMissedCalls
                        btnClassName='btn-danger'
                        label="VIEW_MISSED_CALLS"
                    />
                    <ViewDataTable
                     customStyles={{
                        headCells: {
                            style: {
                                background: "#5bb0b9",
                                color: "white"
                            },
                        },
                    }}
                        columns={[
                            {
                                name: "id",
                                selector: applicant => applicant.id
                            },
                            {
                                name: "name",
                                selector: applicant => `${applicant.first_name} ${applicant.last_name}`,
                                hidable: false
                            },
                            {
                                name: "email",
                                selector: applicant => applicant.email,
                                hidable: false
                            },
                            {
                                name: "phone",
                                selector: applicant => applicant.phone,
                                hidable: false
                            },
                        ]}
                        actions={applicant => ([
                            {
                                onClick: e => openCallDialog(applicant),
                                icon: TelephoneFill,
                                label: "MAKE_CALL"
                            },
                        ])}
                        items={applicants}
                    />
                </Col>
            </Row>

            <Modal
                show={showCaller}
                onHide={handleHideCaller}
                backdrop="static"
                keyboard={false}
                className="bg-secondary "
            >
                <Modal.Header className="dialer__close bg-dark" closeVariant="white" closeButton />
                <Modal.Body className="bg-dark ">
                    <Container className="mt-2">
                        <Row className="justify-content-center">
                            <div className="phone">
                                <Col lg='12' className="text-center">
                                    <div id="btns" className="justify-content-center mt-4">
                                        <img style={{ width: 300, padding: 30, borderRadius: 250 }} src="/img/avatar.png" />
                                    </div>
                                    <h4 className="text-white-50 pb-0">
                                        {`${identity.first_name} ${identity.last_name}`}
                                    </h4>
                                    <h3 className="text-info pb-3">
                                        {(identity.phone)}
                                    </h3>
                                </Col>
                                <Col lg='12' className="text-center pb-5  rounded">
                                    <h5 className="text-white pt-3 pb-2">
                                        {status}
                                    </h5>
                                    {
                                        !!!connected ?
                                            <button onClick={connectCall}
                                                id="call"
                                                className="btn btn-success rounded-circle">
                                                < TelephoneOutboundFill />
                                            </button>
                                            :
                                            <button onClick={disconnectCall}
                                                id="end"
                                                className="btn btn-danger rounded-circle">
                                                < TelephoneMinusFill />
                                            </button>
                                    }
                                </Col>
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
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