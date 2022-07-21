import { useEffect, useState } from "react";
import DocumentApi from "../../../pages/api/document";
import { useEffectAsync } from "../../../utils/react";

export default function UserPhoto({ user, style, className, width, height }) {


    const [photo, setPhoto] = useState("/dashboard/assets/images/users/user1.jpg")
    const documentApi = new DocumentApi();

    const fetchUserphoto = async () => {
        if (!!user && !!user.photo?.id)
            await documentApi.getPhoto(user.photo.id)
                .then(file => setPhoto(file.path))
                .catch(error => console.error("error", error))
    }

    useEffectAsync(async () => {
        await fetchUserphoto()
    }, [])

    return <>
        <img
            style={style}
            className={className}
            width={width}
            height={height}
            src={photo} />
    </>
}