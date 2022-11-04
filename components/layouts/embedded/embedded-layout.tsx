import Head from 'next/head'
import { Scripts } from '../../scripts/scripts';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from '../../../hooks/use-translation'
import { ToastContainer } from 'react-toastify';

export interface EmbeddedLayoutProps {
    title?: string;
    readonly children?: React.ReactChild | React.ReactChildren | any
}

export function EmbeddedLayout({ children, title }: EmbeddedLayoutProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{"Driverfly"} {title ? `| ${t(title)}` : ""}</title>
                <link rel="icon" href="/img/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            </Head>
            {/* <Header /> */}
            <ToastContainer />
            <main>{children}</main>
            {/* <Footer /> */}
            <Scripts />
        </>
    )
}