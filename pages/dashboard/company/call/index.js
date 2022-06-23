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

    const setup = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`https://YOUR-WALKIE-TALKIE-URL-dev.twil.io/token?identity=${identity}`)
            const data = await response.json();
            device.setup(data.accessToken);
            device.audio.incoming(false);
            device.audio.incoming(false);
            device.audio.outgoing(false);
            device.audio.disconnect(false);
            setDevice(device)
        } catch (err) {
            console.log("setup error.....", err)
        }
    }

    const connect = () => {
        const recipient = identity === 'friend1' ? 'friend2' : 'friend1';
        device.connect({ recipient })
    }

    const disconnect = () => { device.disconnectAll() }

    const createDevice = async () => {

        const Device = (await import('twilio-client')).Device
        setDevice(new Device());

        device.on('incoming', connection => {
            connection.accept()

            setStatus(connection.status())
        });

        device.on('ready', () => {
            setStatus("Device ready");
            setReady(true);
        })

        device.on('connect', connection => {
            setStatus(connection.status())
        })

        device.on('disconnect', connection => {
            setStatus(connection.status())
        })
    }


    useEffect(async () => {
        await createDevice()
            .catch(error => { console.log("creating device error....", error) })
    }, [])

    return (
        <>
            <div>
                <h4>Status: {status}</h4>
                {ready
                    ? <button
                        onMouseDown={connect}
                        onMouseUp={disconnect}
                    >Press to Talk</button>
                    : <>
                        <p>Enter your name to begin.</p>
                        <form onSubmit={(e) => setup(e)}>
                            <input
                                className='form-control m-2'
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                type="text"
                                placeholder="What's your name?"></input>
                            <input
                                className='btn btn-primary m-2'
                                type="submit"
                                value="Begin Session"></input>
                        </form>
                    </>
                }
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