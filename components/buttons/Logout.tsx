import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from "../../hooks/useTranslation";
import { Dropdown } from "react-bootstrap";

export interface LogoutProps {
    as?: React.ElementType;
    className?: string;
}

export default function Logout(props: LogoutProps) {
    let { as: Cmp = Dropdown.Item, className } = props;

    const { t } = useTranslation();
    const { logout } = useAuth();

    return (
        <Cmp
            className={className}
            onClick={logout}>
            {t("LOGOUT")}
        </Cmp>
    )
}