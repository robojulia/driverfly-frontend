import { Container } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../hooks/useTranslation";
import { Row, Col } from "react-bootstrap";

export interface PageLayoutProps {
    title?: string;
    actions?: JSX.Element | JSX.Element[];
    children?: JSX.Element | JSX.Element[];
}

export default function PageLayout(props: PageLayoutProps) {
    const { title, actions, children } = props;

    const { t } = useTranslation();

    return (
        <>
            <ToastContainer />
            <Row>
                {
                    title &&
                        <Col>
                            <h2>
                                {t(title)}
                            </h2>
                        </Col>
                }
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