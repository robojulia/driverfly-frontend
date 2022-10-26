import { PublicLayout } from "../../components/layouts/public-layout";

export default function Index()
{
    return (
        <>
        </>
    )

}

Index.getLayout = function getLayout(page) {
    return (
        <PublicLayout>
            {page}
        </PublicLayout>
    )
}