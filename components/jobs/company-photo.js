import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";

export default function CompanyPhoto(props) {

    const [photo, setPhoto] = useState("/driverfly-logo-square.png")

    useEffect(async () => {
        const api = new DocumentApi();
        if (props.company?.photo) {
            await api.getSignedUrl(props.company.photo.id)
                .then(file => {
                    setPhoto(file.path || "/driverfly-logo-square.png")
                }).catch(error => {
                    console.error("error", error);
                })
        }
    })

    return <>
        <img
            className={props.className}
            src={photo}
            alt="Company Image" />
    </>
}