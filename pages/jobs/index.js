import Head from "next/head";
import Layout from "../../components/layouts";
// import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";


export default function About()
{
    return (
        <>
        </>
    )

    export async function getStaticProps(context) {

        const res = await fetch('https://jsonplaceholder.typicode.com/users/' + context.params.id)
        const user = await res.json()
    
        return {
            props: {
                user,
            },
        }
    }
    
}

About.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}