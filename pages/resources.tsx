import Link from 'next/link';
import { PublicLayout } from "../components/layouts/public-layout";
import { Accordion, Container } from 'react-bootstrap';
import FreeResources from '../components/free-resources';
import { useTranslation } from "../hooks/use-translation";

export default function FreeResource() {
    const { t } = useTranslation();
    return (
        <>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>{t("RESOURCES")}</h2>
                    </div>
                </div>
            </div>
            <Container fluid className='my-5'>
                <FreeResources />
            </Container>
        </>
    )
}
FreeResource.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="Resources">
            {page}
        </PublicLayout>
    )
}

