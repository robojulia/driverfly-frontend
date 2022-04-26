import "../public/css/owl.carousel.css";
import "../public/css/owl.theme.default.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../public/css/style.css";
import "../public/css/responsive.css";
import "../public/dashboard/styles/css/global.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../lang/i18nextconfig";
// import { appWithTranslation } from 'next-i18next';

import { useEffect } from "react";

function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page)

  useEffect(async () => {
    import("bootstrap/dist/js/bootstrap");
    // await i18n.init();

  }, []);

  return getLayout(<Component {...pageProps} />)
}

export default MyApp;
// export default appWithTranslation(MyApp);
