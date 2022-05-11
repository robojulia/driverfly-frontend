import Head from 'next/head'
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Scripts from './scripts';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            </Head>
            <Header />
            <main>{children}</main>
            <Footer />
            <Scripts />
        </>
    )
}