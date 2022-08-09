import { PublicLayout } from "../components/layouts/PublicLayout";

// PAGE DEPRECATED IN FAVOR OF /login/verify-email
export default function VerifyEmailToken() {
  return (
    <>Oops... not sure how you got to this page, it has been deprecated</>
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