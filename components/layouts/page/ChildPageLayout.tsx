import { useRouter } from "next/router";
import { Col, Container, Row } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChevronLeft } from "react-bootstrap-icons";
import useLastPage from "../../../hooks/useLastPage";
import { useTranslation } from "../../../hooks/useTranslation";
import { PageLayoutProps } from "./PageLayout";

export interface ChildPageLayoutProps extends PageLayoutProps {
    backPath?: string;
}

export default function ChildPageLayout({ title, backPath, actions, children }: ChildPageLayoutProps) {
    const router = useRouter();
    const { t } = useTranslation();

    const { previousPath } = useLastPage();

    const handleBack = (e) => {
        e.preventDefault();
        if (backPath)
            router.push(backPath);
        else if (previousPath)
            router.push(previousPath);
        else
            router.back();
    }

    return (
        <>
            <ToastContainer />
            <Row>
                <Col>
                    <h2>
                        <span style={{cursor: "pointer"}} onClick={handleBack}><ChevronLeft /></span>
                        {t(title || "GO_BACK")}
                    </h2>
                </Col>
                {
                    actions &&
                    <Col className="text-right text-nowrap">
                        {actions}
                    </Col>
                }
            </Row>
            <Container fluid className="p-2">
                {children}
            </Container>
        </>
    );

}