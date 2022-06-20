import { useTranslation } from "../../hooks/useTranslation";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { X, XLg } from "react-bootstrap-icons";

export interface ViewModalProps {
    show?: boolean;
    title?: string;
    header?: string|JSX.Element|JSX.Element[];
    footer?: string|JSX.Element|JSX.Element[];
    closeText?: string;
    onCloseClick?: () => void;
    children?: JSX.Element|JSX.Element[];
}

export default function ViewModal(props: ViewModalProps) {
    const { t } = useTranslation();
    const [ show, setShow ] = useState(!!props.show);

    useEffect(() => {
        setShow(!!props.show);
    }, [ props ]);

    const hideModelHandler = () => {
        setShow(false);
    }

    return (
    <Modal show={show} onHide={props.onCloseClick ?? hideModelHandler}>
        <Modal.Header className="justify-content-between">
            {
                props.title &&
                <h4 className="modal-title font-weight-normal">
                    {typeof props.title === "string" ? t(props.title) : props.title}
                </h4>
            }
            {props.header}
            <Button variant=" theme-general-btn " onClick={props.onCloseClick ?? hideModelHandler}>
                <XLg /> {t(props.closeText || "CLOSE")}
            </Button>
        </Modal.Header>

        <Modal.Body>{props.children}</Modal.Body>

        {
            props.footer &&
            <Modal.Footer>
                {props.footer}
            </Modal.Footer>
        }

    </Modal>
);
}