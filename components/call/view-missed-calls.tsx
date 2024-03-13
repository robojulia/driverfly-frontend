import { useTranslation } from "../../hooks/use-translation";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import ViewModal from "../view-details/view-modal";
import { useEffectAsync } from "../../utils/react";
import TwilioApi from "../../pages/api/twilio";
import ViewDataTable from "../view-details/view-data-table";

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
            const callsData = await twilioApi.getMissedCall()
                .then((data) => {
                    setLogs(data)
                    setloading(false)
                    console.log("Calls list Success : ");
                })
                .catch(error => console.log("Calls list error : ",error?.response?.data?.message))

                console.log("Calls List :",callsData);
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