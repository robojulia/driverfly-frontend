import { Container } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../../hooks/use-translation";
import { Row, Col } from "react-bootstrap";

export interface PageLayoutProps {
    title?: string;
    desciption?: string;
    actions?: JSX.Element | JSX.Element[];
    hideTitle?: boolean;
    readonly children?: JSX.Element | JSX.Element[];
}

export default function PageLayout(props: PageLayoutProps) {
    const { title, actions, children, desciption, hideTitle } = props;

    const { t } = useTranslation();

    return (
        <>
            <ToastContainer />
            <Row>
                {
                    title && !hideTitle &&
                        <Col>
                            <h2 style={{ marginBottom: '0.75rem' }}>
                                {t(title)}
                            </h2>
                            {
                                desciption &&  <p className="small text-secondary" style={{ marginBottom: '1rem' }}>{t(desciption)}</p>
                            }
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