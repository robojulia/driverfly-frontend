import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";

export default function CompanyPhoto(props) {

    const [url, setUrl] = useState("/driverfly-logo-square.png")

    useEffect(async () => {
        const api = new DocumentApi();
        if (false) {
        // if (props.company?.photo?.[0]?.id) {
            await api.getSignedUrl(props.company?.photo?.[0]?.id)
                .then(document => {
                    console.log("url", document.path);
                    setUrl(document.path || "/driverfly-logo-square.png")
                }).catch(error => {
                    console.error("error", error);
                })
        }
    })

    return <>
        <img
            className={props.className}
            src={url}
            alt="Company Image" />
    </>
}