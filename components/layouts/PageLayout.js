import { Container } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../hooks/useTranslation";

/**
 * 
 * @param {object} param0 
 * @param {string} param0.title
 * @param {any} param0.children
 * @returns 
 */
export default function PageLayout({ title, children }) {
    const { t } = useTranslation();
    return (
        <>
            <ToastContainer />
            { title &&
                <h2>
                    {t(title)}
                </h2>
            }
            <Container fluid className="p-2">
                {children}
            </Container>
        </>
    );
}