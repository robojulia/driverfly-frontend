import Head from 'next/head'
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Scripts from './scripts';

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <link href="https://fonts.cdnfonts.com/css/arial" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            </Head>
            <Header />
            <main>{children}</main>
            <Footer />
            <Scripts />
        </>
    )
}