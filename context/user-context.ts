import { createContext } from "react";
import { UserEntity } from "../models/user/user.entity";

const UserContext = createContext<{
    user: UserEntity,
    setUser: (e: UserEntity) => void
}>({
    user: null,
    setUser: (e: UserEntity) => {}
});
UserContext.displayName = "User";

export {
    UserContext
}
