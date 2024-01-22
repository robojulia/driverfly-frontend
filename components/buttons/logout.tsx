import { useAuth } from "../../hooks/use-auth";
import { useTranslation } from "../../hooks/use-translation";
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
    <button className={className} onClick={logout}>
      {t("LOGOUT")}
    </button>
  );
}
