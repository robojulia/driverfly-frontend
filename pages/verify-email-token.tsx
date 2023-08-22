import { PublicLayout } from "../components/layouts/public-layout";
import Head from "next/head";

// PAGE DEPRECATED IN FAVOR OF /login/verify-email
export default function VerifyEmailToken() {
  return (
    <>
        <Head>
        <title>Verify Email Token - Securely Verify Your DriverFly Account</title>
        <meta
          name="description"
          content="Securely verify your DriverFly account through an email token. Confirm your account and unlock a world of opportunities in trucking."
          key="desc"
        />
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