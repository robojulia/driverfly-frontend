import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../../hooks/use-translation";
import { Camera } from "react-camera-pro";
import { FormikInterface } from "../../../../../utils/formik";
interface CameraCompProps {
    form?: FormikInterface<any>
}

export function CameraComponent({ form }: CameraCompProps) {

    const camera = useRef(null);
    const [image, setImage] = useState<string>(null);
    const date = new Date()
    const { t } = useTranslation();

    const handleCameraEvents = () => {
        const img = camera.current.takePhoto()
        setImage(img)


        const byteCharacters = atob(img.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const imgPath = URL.createObjectURL(blob)


        let extensionStart = img.indexOf("/") + 1;
        let extensionEnd = img.indexOf(";");
        let extension = img.slice(extensionStart, extensionEnd);

        form.setFieldValue("document.file_base64", img.split(',')[1])
        form.setFieldValue("document.path", imgPath)
        form.setFieldValue("document.mime_type", `image/${extension}`)
        form.setFieldValue("document.name", `${date.toISOString()}.${extension}`)

    }
    return (
        <Form>
            <div className={`${styles.align__text_left} ${styles.bold}`}>
                {/* testing */}
                {
                    !image ? (
                        <Row className={styles.camera_container_main}>
                            <div className={styles.camera_container}>
                                <Camera ref={camera}
                                    facingMode="environment"
                                    errorMessages={{
                                        noCameraAccessible: "",
                                        permissionDenied: "",
                                        switchCamera: "",
                                        canvas: ""
                                    }} />
                            </div>
                            <Button
                                className={styles.capture_btn}
                                onClick={handleCameraEvents}>{t('CAPTURE')}</Button>
                        </Row>
                    ) : (
                        <Row>
                            <img src={image} alt='Taken photo' />

                            <Row className="my-3 ml-1 p-2">
                                <Button className="p-2" onClick={() => setImage(null)}>{t('NEW_IMAGE')}</Button>
                            </Row>

                        </Row>
                    )
                }
            </div>
        </Form>
    )
}
