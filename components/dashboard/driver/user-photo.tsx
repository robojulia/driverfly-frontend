import { useState } from "react";
import { useAuth } from "../../../hooks/use-auth";
import DocumentApi from "../../../pages/api/document";
import { useEffectAsync } from "../../../utils/react";

export default function UserPhoto({ style, className, width, height }) {

    const { user } = useAuth();
    const [photo, setPhoto] = useState("/dashboard/assets/images/users/user1.jpg")
    const documentApi = new DocumentApi();

    const fetchUserphoto = async () => {
        if (!!user && !!user.photo?.id) {
            await documentApi.getPhoto(user.photo.id)
                .then(file => setPhoto(file.path))
                .catch(error => console.error("error", error))
        } else {
            setPhoto("/dashboard/assets/images/users/user1.jpg")
        }
    }

    useEffectAsync(async () => {
        await fetchUserphoto()
    }, [])

    useEffectAsync(async () => {
        await fetchUserphoto()
    }, [user])

    return <img
        style={style}
        className={className}
        width={width}
        height={height}
        src={photo}
        alt="User profile" />
}
