import { useEffect, useState, useMemo, useCallback } from "react";
import DocumentApi from "../../pages/api/document";

export default function CompanyPhoto(props) {

    const [photo, setPhoto] = useState("/truck-icon-DriverFly.png")
    const documentApi = useMemo(() => new DocumentApi(), []);

    const fetchVehiclephoto = useCallback(async () => {
        if ((!!!props.job?.vehicles?.length))
            return false

        let ret = false
        for (const vehicle of props.job.vehicles) {
            if (!!vehicle.photo?.id && !!vehicle.is_public)
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
    }, [documentApi, props.job?.vehicles])

    useEffect(() => {
        const loadPhoto = async () => {
            await fetchVehiclephoto()
                .then(async (status) => {
                    if ((!status) && props.company?.photo) {
                        await documentApi.getPhoto(props.company.photo.id)
                            .then(file => setPhoto(file.path || "/truck-icon-DriverFly.png"))
                            .catch(error => console.error("error", error))
                    }
                })
        }
        loadPhoto()
    }, [documentApi, fetchVehiclephoto, props.company?.photo])

    return <>
        <img
            className={`${props.className}`}
            style={props.style}
            src={photo}
            alt="Company Image" />
    </>
}