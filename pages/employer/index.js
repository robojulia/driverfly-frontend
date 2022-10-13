import { PublicLayout } from "../../components/layouts/PublicLayout";

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