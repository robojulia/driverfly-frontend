import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";

export default function CompanyPhoto(props) {

    const [photo, setPhoto] = useState("/driverfly-logo-square.png")
    // console.log("props.company", props.company);

    useEffect(async () => {
        const api = new DocumentApi();
        if (props.company) {
            await api.getCompanyPhoto(props.company.id)
                .then(base64 => {
                    // console.log("base64", base64);
                    setPhoto(base64 || "/driverfly-logo-square.png")
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