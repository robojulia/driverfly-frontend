import "../public/css/owl.carousel.css";
import "../public/css/owl.theme.default.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../public/css/style.css";
import "../public/css/responsive.css";
import "../public/dashboard/styles/css/global.css";

import "../lang/i18nextconfig";


import { useEffect } from "react";

function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page)

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return getLayout(<Component {...pageProps} />)
}

export default MyApp
