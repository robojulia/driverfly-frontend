import { useContext, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../../hooks/use-translation";
import { Camera } from "react-camera-pro";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";

export function CameraComponent() {
    const {
        method: { stepBack }
    }: JotFormContextType = useContext(JotformContext);
    const camera = useRef(null);
    const [image, setImage] = useState(null);

    const { t } = useTranslation();

    const handleCameraEvents = () => {
        const img = camera.current.takePhoto()
        setImage(img)
        console.log(img)
    }
    const blockerAlert = () => {
        alert(`${t('CAMERA_BLOCKER')}`)
        stepBack()
    }
    return (
        <Form>

            <Row className={`${styles.align__text_left} ${styles.bold}`}>
                {
                    !image ? (
                        <Row style={{ position: 'relative' }}>

                            <div style={{ zIndex: '1', height: '60vh' }}>
                                <Camera ref={camera}
                                    facingMode="environment"
                                    errorMessages={{
                                        noCameraAccessible: "",
                                        permissionDenied: "",
                                        switchCamera: "",
                                        canvas: ""
                                    }} />
                            </div>
                            <Col style={{ zIndex: '2' }}>
                                <Button
                                    style={{
                                        borderRadius: '50%',
                                        height: '80px',
                                        width: '80px',
                                        position: 'absolute',
                                        marginBottom: '0',
                                        marginLeft: 0,
                                        transform: 'translate(400%, -110%)'
                                    }}
                                    onClick={handleCameraEvents}>{t('CAPTURE')}</Button>

                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <img src={image} alt='Taken photo' />
                            <Row className="mt-2 mb-2">

                                <Col className="text-center float-right">
                                    <Button onClick={() => setImage(null)}>{t('NEW_IMAGE')}</Button>
                                </Col>
                                <Col className="text-center float-left">
                                    <Button onClick={blockerAlert}>{t('UPLOAD_THIS_IMAGE')}</Button>
                                </Col>
                            </Row>

                        </Row>
                    )
                }

            </Row>

        </Form>
    )
}
