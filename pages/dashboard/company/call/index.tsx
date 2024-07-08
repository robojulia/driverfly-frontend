import { useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import {
    TelephoneFill,
    TelephoneOutboundFill,
    TelephoneXFill,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import ViewMissedCalls from "../../../../components/call/view-missed-calls";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import { TabbedLayout } from "../../../../components/layouts/page/tabbed-layout";
import ViewDataTable from "../../../../components/view-details/view-data-table";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import { useEffectAsync } from "../../../../utils/react";
import ApplicantApi from "../../../api/applicant";
import EmployeeApi from "../../../api/employee";
import TwilioApi from "../../../api/twilio";

export default function Call() {
    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();
    const employeeApi = new EmployeeApi();
    const twilioApi = new TwilioApi();

    const [callingId, setCallingId] = useState(null);
    const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
    const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
    const [device, setDevice] = useState(null);
    const [identity, setIdentity] = useState<ApplicantEntity>({});
    const [status, setStatus] = useState("Disconnected");
    const [ready, setReady] = useState(false);
    const [connected, setConnected] = useState(false);
    const [loading, setloading] = useState(true);

    const [showCaller, setShowCaller] = useState(false);
    const handleShowCaller = () => setShowCaller(true);
    const handleHideCaller = () => {
        disconnectCall();
        setShowCaller(false);
        setReady(false);
    };

    useEffectAsync(async () => {
        await twilioApi
            .getPhoneNumber()
            .then(({ value }) => setCallingId(value || null))
            .catch((error) =>
                toast.error(
                    t(error?.response?.data?.message || "NO_TWILIO_NUMBER_AVAILABLE")
                )
            );

        await applicantApi
            .list()
            ?.then((data) => {
                setloading(false);
                setApplicants((data as ApplicantEntity[])?.filter((v) => Boolean(v.phone)));
            })
            .catch((error) =>
                console.error("applicantApi.list error....", error.response)
            );
        await employeeApi
            .list()
            ?.then((data) => {
                setloading(false);
                setEmployees(data?.filter((v) => Boolean(v.phone)));
            })
            .catch((error) =>
                console.error("employeeApi.list error....", error.response)
            );
    }, []);

    const setupTwilio = async () => {
        if (!!callingId) {
            twilioApi.generateToken().then(async ({ token }) => {
                await setupClient(token).catch((error) =>
                    console.error("creating device error....", error)
                );
            });
        } else {
            toast.error(t("NO_TWILIO_NUMBER_AVAILABLE"));
        }
    };

    const setupClient = async (token: string): Promise<void> => {
        try {
            const Device = (await import("twilio-client")).Device;
            const client = new Device(token, {
                debug: true,
                appName: process.env.TWILIO_APP_NAME || "driverfly",
            });

            client.on("ready", (device) => {
                setConnected(false);
                setStatus(t("READY_TO_CALL"));
                setReady(true);
            });

            client.on("error", (error) => {
                console.log("Twilio.Device Error: " + error.message);
                setStatus("ERROR: " + error.message);
            });

            client.on("connect", (conn) => {
                setConnected(true);
                setStatus(t("CALLINHG"));
            });

            client.on("disconnect", (conn) => {
                setConnected(false);
                setStatus(t("READY_TO_CALL"));
            });

            client.on("incoming", (conn) => {
                setStatus(t("INCOMMING_SUPPORT_CALL"));

                conn.accept(function () {
                    setStatus(t("IN_CALL_WITH_USER"));
                });
            });

            setDevice(client);
        } catch (error) { }
    };

    const connectCall = () => {
        setConnected(true);
        if (identity?.phone) {
            const connection = device.connect({
                PhoneNumber: formatPhoneNumber(identity.phone),
                from: callingId,
            });
            // connection?.on('connecting', function (status) {
            //     console.log('Call status:', status);
            // });
        }
    };

    const disconnectCall = () => {
        setConnected(false);
        device.disconnectAll();
    };

    const openCallDialog = async (entity) => {
        console.log("Emp/Applicant getting to call : ->", entity);
        setloading(true);
        await setupTwilio();
        setIdentity(entity);
    };

    useEffectAsync(async () => {
        if (!!ready) {
            handleShowCaller();
            setloading(false);
        } else {
            // toast.error(t('COULD_NOT_MAKE_CALL'))
        }
    }, [ready]);

    const formatPhoneNumber = (phoneNumberString) =>
        `+${("" + phoneNumberString).replace(/\D/g, "")}`;

    return (
        <>
            {!!loading && <Spinner animation="grow" variant="info" />}

            <Row className="">
                <Col lg="12 ">
                    <ViewMissedCalls
                        btnClassName="btn-danger mb-2"
                        label="VIEW_MISSED_CALLS"
                    />
                    <TabbedLayout
                        items={{
                            APPLICANT: (
                                <ViewDataTable
                                    customStyles={{
                                        headRow: {
                                            style: {
                                                background:
                                                    "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                                                color: "white",
                                            },
                                        },
                                    }}
                                    columns={[
                                        {
                                            name: "ID",
                                            selector: (applicant) => applicant.id,
                                        },
                                        {
                                            name: "name",
                                            selector: (applicant) =>
                                                `${applicant.first_name} ${applicant.last_name}`,
                                            hidable: false,
                                        },
                                        {
                                            name: "email",
                                            selector: (applicant) => applicant.email,
                                            hidable: false,
                                        },
                                        {
                                            name: "phone",
                                            selector: (applicant) => applicant.phone,
                                            hidable: false,
                                        },
                                    ]}
                                    actions={(applicant) => [
                                        {
                                            onClick: (e) => openCallDialog(applicant),
                                            icon: TelephoneFill,
                                            label: "MAKE_CALL",
                                        },
                                    ]}
                                    items={applicants}
                                />
                            ),
                            EMPLOYEES: (
                                <ViewDataTable
                                    customStyles={{
                                        headRow: {
                                            style: {
                                                background:
                                                    "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                                                color: "white",
                                            },
                                        },
                                    }}
                                    columns={[
                                        {
                                            name: "ID",
                                            selector: (employee) => employee.id,
                                        },
                                        {
                                            name: "name",
                                            selector: (employee) =>
                                                `${employee.first_name} ${employee.last_name}`,
                                            hidable: false,
                                        },
                                        {
                                            name: "email",
                                            selector: (employee) => employee.email,
                                            hidable: false,
                                        },
                                        {
                                            name: "phone",
                                            selector: (employee) => employee.phone,
                                            hidable: false,
                                        },
                                    ]}
                                    actions={(employee) => [
                                        {
                                            onClick: (e) => openCallDialog(employee),
                                            icon: TelephoneFill,
                                            label: "MAKE_CALL",
                                        },
                                    ]}
                                    items={employees}
                                />
                            ),
                        }}
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
                <Modal.Header
                    className="dialer__close bg-dark"
                    closeVariant="white"
                    closeButton
                />
                <Modal.Body className="bg-dark ">
                    <Container className="mt-2">
                        <Row className="justify-content-center">
                            <div className="phone">
                                <Col lg="12" className="text-center">
                                    <div id="btns" className="justify-content-center mt-4">
                                        <img
                                            style={{ width: 300, padding: 30, borderRadius: 250 }}
                                            src="/img/avatar.png"
                                        />
                                    </div>
                                    <h4 className="text-white-50 pb-0">
                                        {`${identity.first_name} ${identity.last_name}`}
                                    </h4>
                                    <h3 className="text-info pb-3">{identity.phone}</h3>
                                </Col>
                                <Col lg="12" className="text-center pb-5 rounded">
                                    <h5 className="text-white pt-3 pb-2">{status}</h5>
                                    <div className="call-buttons">
                                        {!!!connected ? (
                                            <Button
                                                variant="success"
                                                onClick={connectCall}
                                                id="call"
                                                className=" p-3 rounded-circle"
                                            >
                                                <TelephoneOutboundFill size={20} />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="danger"
                                                onClick={disconnectCall}
                                                id="end"
                                                className="btn p-3 rounded-circle"
                                            >
                                                <TelephoneXFill size={20} />
                                            </Button>
                                        )}
                                    </div>
                                </Col>
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}

Call.getLayout = function getLayout(page) {
    return <FullLayout>{page}</FullLayout>;
};
