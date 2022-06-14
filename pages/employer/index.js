import Layout from "../../components/layouts";

export default function Index()
{
    return (
        <>
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