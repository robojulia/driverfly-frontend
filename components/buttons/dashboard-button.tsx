import { useAuth } from '../../hooks/use-auth';
import Router from 'next/router'
import { useTranslation } from "../../hooks/use-translation";
import { Dropdown } from "react-bootstrap";


export interface DashboardButtonProps {
    as?: React.ElementType;
    className?: string;
}

export default function DashboardButton(props:DashboardButtonProps) {
    let { as: Cmp = Dropdown.Item, className } = props;
    const { t } = useTranslation();
    const { getUser } = useAuth();

    const handleRedirect = () => {
        const user = getUser();

        if (user?.company) {
            Router.push('/dashboard/company')
        } else if (user) {
            Router.push('/dashboard/driver')
        } else {
            Router.push('/')
        }
    }

    return (
        <>
            <Cmp
                onClick={handleRedirect}
                type="button"
                className={props.className}>
                {t("dashboard")}
            </Cmp>
        </>
    )
}