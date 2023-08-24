import { PublicLayout } from "../components/layouts/public-layout";
import Head from "next/head";
import { useTranslation } from "../hooks/use-translation";

// PAGE DEPRECATED IN FAVOR OF /login/verify-email
export default function VerifyEmailToken() {

  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("VERIFY_EMAIL_META_TITLE")}</title>
        <meta name="description" content={t("VERIFY_EMAIL_META_DESC")} key="desc" />
      </Head>
    Oops... not sure how you got to this page, it has been deprecated</>
  )
}
export async function getServerSideProps({ res, query }) {
  const { emailVerifyToken } = query

  if (!emailVerifyToken) {
    return {
      notFound: true
    }
  }

  res.writeHeader(307, { Location: `/login/verify-email?token=${emailVerifyToken}` })
  res.end()

  return {
    props: {}
  };
}

VerifyEmailToken.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      {page}
    </PublicLayout>
  )
}