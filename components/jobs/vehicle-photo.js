import { useEffect, useState } from "react";
import DocumentApi from "../../pages/api/document";
import ViewModal from "../viewDetails/viewModal";

export default function VehiclePhoto({ vehicle, style, className }) {
console.log(vehicle,'vasadasdsa')
if (!!!vehicle || !!!vehicle.photo?.id)
return <></>
const [showVehiclePhoto, setShowVehiclePhoto] = useState(false)
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

function close() {
setShowVehiclePhoto(false);
}
return <>
<img
onClick={() => setShowVehiclePhoto(true)}
style={style}
className={className}
src={photo} />

{showVehiclePhoto == true && <ViewModal show={!!photo} title={vehicle.photo?.name} onCloseClick={close}>
<img className="img-thumbnail" src={photo} />
</ViewModal>}
</>
}