import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChevronLeft } from "react-bootstrap-icons";
import useLastPage from "../../hooks/useLastPage";
import { useTranslation } from "../../hooks/useTranslation";

/**
 * @typedef ChildPageLayoutProps
 * @property {string} title defaults to "GO_BACK"
 * @property {string} backPath
 * @property {import("react").ReactChild[]} children
 */

/**
 * This method will render a page that is considered a child of another page (with a "go back" button)
 * @param {ChildPageLayoutProps} props
 */
export default function ChildPageLayout({ title, backPath, children }) {
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
            <h2>
                <span style={{cursor: "pointer"}} onClick={handleBack}><ChevronLeft /></span>
                {t(title || "GO_BACK")}
            </h2>
            <Container fluid className="p-2">
                {children}
            </Container>
        </>
    );

}