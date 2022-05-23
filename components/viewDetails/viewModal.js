import { useTranslation } from "../../hooks/useTranslation";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { X, XLg } from "react-bootstrap-icons";

/**
 * @typedef ViewModalProps
 * @property {boolean} show
 * @property {string} title
 * @property {string|JSX.Element|JSX.Element[]} header
 * @property {string|JSX.Element|JSX.Element[]} footer
 * @property {string} closeText
 * @property {() => void} onCloseClick
 * @property {JSX.Element|JSX.Element[]} children
 */

/**
 * 
 * @param {ViewModalProps} props 
 * @returns 
 */
export default function ViewModal(props) {
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
            <Button variant="secondary" onClick={props.onCloseClick ?? hideModelHandler}>
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