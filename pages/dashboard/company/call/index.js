import LogoutButton from '../../../../components/buttons/Logout';
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useRedirect from '../../../../hooks/useRedirect';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

export default function Call() {

    const { authCompany } = useRedirect();
    authCompany()


    const [device, setDevice] = useState(null)
    const [identity, setIdentity] = useState("")
    const [status, setStatus] = useState(null)
    const [ready, setReady] = useState(false)


    useEffect(() => {
        async function createDevice() {

            const Device = (await import('twilio-client')).Device
            const device = new Device();

            device.on('incoming', connection => {
                connection.accept()

                setStatus(connection.status())
            });

            device.on('ready', () => {
                setStatus("device ready");
                setReady(true);
            })

            device.on('connect', connection => {
                setStatus(connection.status())
            })

            device.on('disconnect', connection => {
                setStatus(connection.status())
            })

            setDevice(device);
        }

        createDevice()

    }, [])

    return (
        <>

            <div>
                {ready
                    ? <button
                        onMouseDown={connect}
                        onMouseUp={disconnect}
                    >Press to Talk</button>
                    : <div>
                        <p>Enter your name to begin.</p>
                        <form onSubmit={(e) => setup(e)}>
                            <input
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                type="text"
                                placeholder="What's your name?"></input>
                            <input style={{ padding:'10px', background: '#1b4454', color:'#fff', borderRadius:'10px'}} type="submit" value="Begin Session"></input>
                        </form>
                    </div>
                }
                <p>{status}</p>
            </div>
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