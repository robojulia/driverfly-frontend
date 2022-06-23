import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";

export default function VehiclePhoto({ vehicle, style, className }) {

    if (!!!vehicle || !!!vehicle.photo?.id)
        return <></>

    const [photo, setPhoto] = useState("/driverfly-logo-square.png")
    const documentApi = new DocumentApi();

    const fetchVehiclephoto = async () => {
        await documentApi.getPhoto(vehicle.photo.id)
            .then(file => setPhoto(file.path))
            .catch(error => console.error("error", error))
    }

    useEffect(async () => {
        await fetchVehiclephoto()
    }, [])

    return <>
        <img
            style={style}
            className={className}
            src={photo} />
    </>
}