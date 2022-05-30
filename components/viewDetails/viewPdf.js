import { Modal, Button, Spinner } from "react-bootstrap";
// import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core'
// import '@react-pdf-viewer/core/lib/styles/index.css'
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
// import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import ViewModal from "./viewModal";

import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
/**
 * @typedef ViewPdfProps
 * @property {string} name
 * @property {string} url
 * @property {() => void} onCloseClick
 */

/**
 * 
 * @param {ViewPdfProps} props 
 * @returns 
 */
export default function ViewPdf(props) {
    const { t } = useTranslation();
    const defaultLayoutPluginInstance = defaultLayoutPlugin()

    const { name, url, onCloseClick } = props;

    return (
        <></>
        // <ViewModal show={!!url} title={name} onCloseClick={onCloseClick}>
        //     {(
        //         url &&
        //         <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.js">
        //         <div style={{
        //         border: '1px solid rgba(0, 0, 0, 0.3)',
        //         height: '800px',
        //         }}>
        //         {/* <<Viewer fileUrl={"http://localhost:4000/"+myUser.medical_card} />np */}
        //         <Viewer defaultScale={SpecialZoomLevel.PageWidth} plugins={[defaultLayoutPluginInstance]} renderLoader={() => (
        //             <Spinner animation="border" role="status">
        //             <span className="visually-hidden">{t("LOADING")}...</span>
        //             </Spinner>
        //         )} fileUrl={url} />
        //         {/* )} fileUrl="/resume.pdf" /> */}
        //         </div>
        //     </Worker>
        //     )}
        // </ViewModal>
    );
}