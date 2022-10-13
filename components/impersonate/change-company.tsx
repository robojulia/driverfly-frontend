import { useState } from "react";
import { useRouter } from "next/router";
import { Dropdown, Button, Row } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../hooks/useTranslation";
import AuthApi from "../../pages/api/auth";
import { CompanyEntity } from "../../models/company/company.entity";

export default function ChangeCompany() {
    const { user, updateUser } = useAuth();

    const { t } = useTranslation();

    const router = useRouter();

    const onClick = async (e: React.MouseEvent<HTMLElement>, company: CompanyEntity) => {
        const api = new AuthApi();

        const auth = await api.changeOrganization({ companyId: company.id });

        updateUser(auth);
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = (e) => {
        setDropdownOpen(!dropdownOpen);
    }

    if (!user?.company?.children) return null;

    return (<>
        <Dropdown show={dropdownOpen} onToggle={toggle} >
            <Dropdown.Toggle disabled={user.company.children.length <= 1} variant="light">
                <span>{user.company.name}</span>
            </Dropdown.Toggle >
            <Dropdown.Menu>
                {user.company
                    .children
                    .map((v, i) => (<Dropdown.Item key={v.id} onClick={e => onClick(e, v)}>{v.name} {v.id === user.company.id ? `(${t("CURRENT")})` : ""}</Dropdown.Item>))}
            </Dropdown.Menu>
        </Dropdown>
    </>);
}
