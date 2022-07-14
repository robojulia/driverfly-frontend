import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { useEffect, useState } from 'react';
import CallApi from "../../../api/call"
import { useTranslation } from "../../../../hooks/useTranslation";

export default function Test() {

    const { t } = useTranslation()

    const callApi = new CallApi()

    const [device, setDevice] = useState(null)
    const [identity, setIdentity] = useState('+923214604331')
    const [status, setStatus] = useState("Disconnected")
    const [ready, setReady] = useState(false)

    const setupTwilio = async () => {
        callApi.generateToken()
            .then(async ({ token }) => {
                await setupClient(token)
                    .catch(error => console.error("creating device error....", error))
            })
    }

    const setupClient = async (token) => {
        try {
            const Device = (await import('twilio-client')).Device
            const client = new Device(token, { debug: true, appName: process.env.TWILIO_APP_NAME || 'driverfly' })

            client.on("ready", (device) => {
                setStatus("Ready to call");
                setReady(true);
            });

            client.on("error", (error) => {
                console.log("Twilio.Device Error: " + error.message);
                setStatus("ERROR: " + error.message);
            });

            client.on("connect", (conn) => {

                setStatus("Calling")
                // if ("PhoneNumber" in conn.message) {
                //     setStatus("In call with " + conn.message.PhoneNumber);
                // }
            });

            client.on("disconnect", (conn) => {

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

        if (identity) device.connect({ 'PhoneNumber': identity, 'call_mode': 'WEB', })
    }

    const disconnectCall = () => {

        device.disconnectAll()
    }

    return (
        <>
            <button
                onClick={setupTwilio}
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
                            onClick={connectCall}
                        >
                            Press to Talk
                        </button>
                        <button
                            className='btn btn-primary m-2'
                            onClick={disconnectCall}
                        >
                            Press to End
                        </button>
                    </>
                }
            </div>
        </>
    )
};

Test.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}