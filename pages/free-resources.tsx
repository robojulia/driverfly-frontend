import Link from 'next/link';
import { PublicLayout } from "../components/layouts/PublicLayout";
import { Accordion, Container } from 'react-bootstrap';
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import FreeResources from '../components/free-resources';


export default function FreeResource() {
    return (
        <>
            <Container>
                <FreeResources />
            </Container>
        </>
    )
}
FreeResource.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="FAQ">
            {page}
        </PublicLayout>
    )
}

