import "../public/css/owl.carousel.css";
import "../public/css/owl.theme.default.min.css";
import "../public/css/style.css";
import "../public/css/responsive.css";
import "../public/dashboard/styles/css/global.css";
import "../public/css/buttons/buttons.css";
import "../public/css/cards/cards.css";
import "../public/css/links/links.css";

// init bootstrap
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../public/bootstrap/css/bootstrap.min.css";

// set up chart JS
import { yupInit } from "../config/yup";
import { chartJsInit } from "../config/chartjs";
import { bootstrapInit } from "../config/bootstrap";
import { ScrollToTOp } from "../config/scroll-to-top";


import { AuthProvider } from "../components/auth/auth-provider";

function MyApp({ Component, pageProps }) {

  chartJsInit();
  bootstrapInit();
  ScrollToTOp();

  return (
    <AuthProvider
      Component={Component}
      pageProps={pageProps}
    />);
}

export default MyApp;
// export default appWithTranslation(MyApp);
