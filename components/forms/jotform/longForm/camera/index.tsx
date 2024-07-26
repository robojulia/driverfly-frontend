import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { Camera, CameraType } from "react-camera-pro";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../../hooks/use-translation";
import { FormikInterface } from "../../../../../utils/formik";

interface CameraCompProps {
    form?: FormikInterface<any>;
    name?: string;
}

export function CameraComponent({ form, name }: CameraCompProps) {

    const camera = useRef<CameraType>(null);
    const [image, setImage] = useState<string | ImageData>(null);

    const date = new Date()
    const { t } = useTranslation();

    const handleCameraEvents = (): void => {
        if (camera.current && camera.current.getNumberOfCameras() > 0) {
            const img = camera.current.takePhoto();
            if (!img || typeof img !== 'string') return;

            setImage(img);

            const byteCharacters = atob(img.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const imgPath = URL.createObjectURL(blob);

            let extensionStart = img.indexOf("/") + 1;
            let extensionEnd = img.indexOf(";");
            let extension = img.slice(extensionStart, extensionEnd);

            form.setFieldValue(`${name ?? "document"}.file_base64`, img.split(',')[1]);
            form.setFieldValue(`${name ?? "document"}.path`, imgPath);
            form.setFieldValue(`${name ?? "document"}.mime_type`, `image/${extension}`);
            form.setFieldValue(`${name ?? "document"}.name`, `${date.toISOString()}.${extension}`);
        }
    };

    return (
        <div className={`${styles.align__text_left} ${styles.bold}`}>
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
                            disabled={!!(camera?.current?.getNumberOfCameras() > 0)}//one ! removed
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
    )
}


