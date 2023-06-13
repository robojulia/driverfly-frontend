import { Container } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import Breadcrumb from "../../breadcrumbs/breadcrumb";

export interface PublicPageProps {
    hideTopLinks?: boolean;
    title: string;
    readonly children: React.ReactNode | React.ReactNode[];
}
export function PublicPage(props: PublicPageProps) {
    const { hideTopLinks, title, children } = props;

    const { t } = useTranslation();

    return (<>
        {!hideTopLinks &&
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>{t(title)}</h2>
                        < Breadcrumb />
                    </div>
                </div>
            </div>
        }
        <Container className="mb-4">
            {children}
        </Container>
    </>);
}