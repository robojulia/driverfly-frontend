import Head from "next/head";
import Layout from "../../components/layouts";
// import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";


export default function Index()
{
    return (
        <>
        <h1>Jobs</h1>
        </>
    )

}

Index.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}