import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";
import ViewModal from "../view-details/view-modal";

export default function VehiclePhoto({ vehicle, style, className }) {

    const documentApi = new DocumentApi();
    const [photo, setPhoto] = useState("/driverfly-logo-square.png")
    const [showVehiclePhoto, setShowVehiclePhoto] = useState(false)
    const closeVehiclePhoto = () => setShowVehiclePhoto(false)

    const fetchVehiclephoto = async () => {
        await documentApi.getPhoto(vehicle.photo.id)
            .then(file => setPhoto(file.path))
            .catch(error => console.error("error", error))
    }

    useEffect(() => {
        if (!!!vehicle || !!!vehicle.photo?.id) return;
        fetchVehiclephoto();
    }, [vehicle, vehicle?.photo?.id])

    if (!!!vehicle || !!!vehicle.photo?.id) return <></>

    return <>
        <img
            onClick={() => setShowVehiclePhoto(true)}
            style={style}
            className={className}
            src={photo} />

        {showVehiclePhoto == true &&
            <ViewModal show={!!photo} title={vehicle.photo?.name} onCloseClick={closeVehiclePhoto}>
                <div className="d-flex justify-content-center">
                    <img className="img-thumbnail" src={photo}/>
                </div>
            </ViewModal>
        }
    </>
}