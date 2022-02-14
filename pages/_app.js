import "../public/css/owl.carousel.css";
import "../public/css/owl.theme.default.min.css";
import "../public/css/bootstrap.min.css";
import "../public/css/style.css";
import "../public/css/responsive.css";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}

export default MyApp
