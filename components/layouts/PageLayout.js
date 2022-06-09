import { Container } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../hooks/useTranslation";
import { Row, Col } from "react-bootstrap";

/**
 * 
 * @param {object} param0 
 * @param {string} param0.title
 * @param {any} param0.actions
 * @param {any} param0.children
 * @returns 
 */
export default function PageLayout({ title, actions, children }) {
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