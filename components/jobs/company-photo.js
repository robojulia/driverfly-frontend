import { style } from "@mui/system";
import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";

export default function CompanyPhoto(props) {

    const [photo, setPhoto] = useState("/driverfly-logo-square.png")
    const documentApi = new DocumentApi();

    const fetchVehiclephoto = async () => {
        if ((!!!props.job?.vehicles?.length))
            return false

        let ret = false
        for (const vehicle of props.job.vehicles) {
            if (!!vehicle.photo?.id)
                await documentApi.getPhoto(vehicle.photo.id)
                    .then(file => {
                        setPhoto(file.path)
                        ret = true
                    })
                    .catch(error => console.error("error", error))

            if (ret == true)
                break
        }
        return ret
    }

    useEffect(async () => {
        await fetchVehiclephoto()
            .then(async (status) => {
                if ((!status) && props.company?.photo) {
                    await documentApi.getPhoto(props.company.photo.id)
                        .then(file => setPhoto(file.path || "/driverfly-logo-square.png"))
                        .catch(error => console.error("error", error))
                }
            })
    }, [])

    return <>
        <img
            className={props.className}
            style={props.style}
            src={photo}
            alt="Company Image" />
    </>
}