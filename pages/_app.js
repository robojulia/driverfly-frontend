import '../public/css/buttons/buttons.css';
import '../public/css/cards/cards.css';
import '../public/css/links/links.css';
import '../public/css/owl.carousel.css';
import '../public/css/owl.theme.default.min.css';
import '../public/css/responsive.css';
import '../public/css/style.css';
import '../styles/main.css';
import '../styles/modern-forms.css';

// init bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../public/bootstrap/css/bootstrap.min.css';

// init fontawsome
import '@fortawesome/fontawesome-free/css/all.css';

// set up chart JS
import { bootstrapInit } from '../config/bootstrap';
import { chartJsInit } from '../config/chartjs';

import ErrorBoundary from '../components/ErrorBoundry';
import { AuthProvider } from '../components/auth/auth-provider';
import { FeatureFlagProvider } from '../context/feature-flag-context';

function MyApp({ Component, pageProps }) {
  chartJsInit();
  bootstrapInit();

  return (
    <>
      {/* <ErrorBoundary> */}
      {/* <ManyChatScript /> */}
      <FeatureFlagProvider>
        <AuthProvider Component={Component} pageProps={pageProps} />
      </FeatureFlagProvider>
      {/* </ErrorBoundary> */}
    </>
  );
}

export default MyApp;
// export default appWithTranslation(MyApp);
