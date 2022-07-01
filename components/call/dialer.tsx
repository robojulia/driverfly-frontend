
import { useState } from "react";
import { Button } from "reactstrap";
import { Modal } from "react-bootstrap";
import { TelephoneFill } from 'react-bootstrap-icons';



export default function Dialer() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Click To Open Dialer
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="dialer__close" closeButton style={{ backgroundColor: "#000" }} >
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#000" }}>
                    <div className="container mt-2">
                        <div className="row justify-content-center">
                            <div className="phone">
                                <div className="container text-center">
                                    <div id="btns" className="row justify-content-center mt-4">
                                        <img style={{ width: 300, padding: 30, borderRadius: 250 }} src="/img/avatar.jpg" />
                                    </div>
                                    <h3 className="text-success pb-3">+923037976657</h3>
                                </div>
                                <div className="container mt-4 rounded">
                                    <div className="row pb-5">
                                        <div className="col text-center">
                                            <button id="call" className="btn btn-success mr-4">
                                                < TelephoneFill />
                                            </button>
                                            <button id="end" className="btn btn-danger">< TelephoneFill /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>


        </>
    );
}