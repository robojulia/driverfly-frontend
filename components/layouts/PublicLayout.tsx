import Head from 'next/head'
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Scripts from '../scripts';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from '../../hooks/useTranslation'
import { ToastContainer } from 'react-toastify';

export interface PublicLayoutProps {
    title?: string;
    readonly children?: React.ReactChild | React.ReactChildren | any
}

export function PublicLayout({ children, title }: PublicLayoutProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{"Driverfly"} {title ? `| ${t(title)}` : ""}</title>
                <link rel="icon" href="/img/DriverFly-Official-Favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            </Head>
            <Header />
            <ToastContainer />
            <main>{children}</main>
            <Footer />
            <Scripts />
        </>
    )
}