import { useEffect, useState } from "react";
import { Dropdown, Button, Row } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from "../../hooks/useTranslation";
import ViewModal from "../viewDetails/viewModal";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
import CompanyApi from "../../pages/api/company";
import AuthApi from "../../pages/api/auth";
import UserApi from "../../pages/api/user";
import { useFormik } from "formik";
import BaseSelect from "../forms/BaseSelect";

export default function Impersonate() {
    const { isSuperUser, isImpersonating } = useAuth();

    const { t } = useTranslation();

    if (!isSuperUser()) return null;

    const impersonating = isImpersonating();

    const [ open, setOpen ] = useState(false);

    /**
     * 
     * @param {React.MouseEvent<HTMLelement>} e 
     */
     const onClick = (e) => {
        setOpen(true);
    };

    const [ companies, setCompanies ] = useState([]);

    const [ users, setUsers ] = useState([]);

    useEffect(async () => {
        if (open) {
            const api = new CompanyApi();

            setCompanies(await api.list());
        }

    }, [ open ]);

    const form = useFormik({
        initialValues: {
            companyId: null,
            userId: null
        },
        onSubmit: async (e) => {
            const api = new AuthApi();
        }
    });

    const onCompanyChange = (e) => {
        const { value } = e.target;

        form.setValues({
            companyId: value,
            userId: null
        });
    };

    useEffect(async () => {
        if (open) {
            const api = new CompanyApi();

            setCompanies(await api.list());
        }

    }, [ open ]);

    // useEffect(async () => {
    //     const api = new UserApi();

    //     api

    //     setCompanies(await api.list());

    // }, [ companyId ]);


    return (<>
        <Dropdown.Item
            onClick={onClick}
            >
            {t("IMPERSONATE")}
        </Dropdown.Item>
        <ViewModal
            title="IMPERSONATE"
            onCloseClick={() => setOpen(false)}
            show={open}
            footer={<>
            {
                impersonating &&
                <Button variant="secondary">
                    <ArrowCounterclockwise /> {t("RESTORE")}
                </Button>
            }
            <Button>{t("SAVE")}</Button>
            </>}
            >
            <form>
                <Row>
                    <BaseSelect
                        className="col-12"
                        label="COMPANY"
                        name="companyId"
                        placeholder
                        onChange={onCompanyChange}
                        options={companies}
                        createLabel={c => `${c.name} (#${c.id})`}
                    />

                </Row>

            </form>

        </ViewModal>
    </>);
}
