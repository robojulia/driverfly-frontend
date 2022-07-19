import { useTranslation } from "../../hooks/useTranslation";
import { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import ViewModal from "../viewDetails/viewModal";
import { useEffectAsync } from "../../utils/react";
import TwilioApi from "../../pages/api/twilio";
import ViewDataTable from "../viewDetails/viewDataTable";

export interface ViewMissedCallsProps {
    label: string;
    btnClassName?: string;
}

export default function ViewMissedCalls(props: ViewMissedCallsProps) {

    const { t } = useTranslation();
    const twilioApi = new TwilioApi()

    const [logs, setLogs] = useState([]);
    const [loading, setloading] = useState(false)
    const [show, setShow] = useState(false);
    const onShowClick = () => { setShow(true) }
    const onCloseClick = () => { setShow(false) }

    const fetchLogs = async () => {
        if (!!show) {
            setloading(true)
            await twilioApi.getMissedCall()
                .then((data) => {
                    setLogs(data)
                    setloading(false)
                })
                .catch(error => console.log(error?.response?.data?.message))
        } else {
            setLogs([])
        }
    }

    useEffectAsync(async () => {
        await fetchLogs()
    }, [show]);

    return (
        <>
            <Button
                className={props.btnClassName}
                onClick={onShowClick}>
                {t(props.label)}
            </Button>
            <ViewModal
                show={show}
                onCloseClick={onCloseClick}
                title={props.label}
            >
                <>
                    {!!loading && <Spinner animation="grow" variant="info" />}
                    <ViewDataTable
                        columns={[
                            {
                                name: "CALL_START_TIME",
                                selector: log => `${new Date(log.startTime).toDateString()} ${new Date(log.startTime).toLocaleTimeString()}`,
                                hidable: false
                            },
                            {
                                name: "CALL_FROM",
                                selector: log => log.fromFormatted,
                                hidable: false
                            },
                        ]}
                        items={logs}
                    />
                </>
            </ViewModal>
        </>
    );
}