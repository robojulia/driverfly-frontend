import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * @typedef ViewModalProps
 * @property {boolean} show
 * @property {string} title
 * @property {() => void} onCloseClick
 * @property {any} children
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
        {props.title && <Modal.Header>{typeof props.title === "string" ? t(props.title) : props.title}</Modal.Header>}

        <Modal.Body>{props.children}</Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={props.onCloseClick ?? hideModelHandler}>{t("CLOSE")}</Button>
        </Modal.Footer>

    </Modal>
);
}