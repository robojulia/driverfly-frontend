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
                <Col xs="10">
                {
                    title &&
                        <h2>
                            {t(title)}
                        </h2>
                }
                </Col>
                {
                    actions && 
                        <Col xs="2" className="text-right text-nowrap">
                        {actions.map((action) => 
                            <button key={action.title} className="btn btn-primary" onClick={action.onClick}>
                            + {t(action.title)}
                            </button>
                        )}
                        </Col>
                }
            </Row>
            <Container fluid className="p-2">
                {children}
            </Container>
        </>
    );
}