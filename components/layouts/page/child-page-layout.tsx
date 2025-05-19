import { useRouter } from 'next/router';
import { Col, Container, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeft } from 'react-bootstrap-icons';
import useLastPage from '../../../hooks/use-last-page';
import { useTranslation } from '../../../hooks/use-translation';
import { PageLayoutProps } from './page-layout';

export interface ChildPageLayoutProps extends PageLayoutProps {
  backPath?: string;
}

export default function ChildPageLayout({
  title,
  backPath,
  actions,
  children,
}: ChildPageLayoutProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const { previousPath } = useLastPage();

  const handleBack = (e) => {
    e.preventDefault();
    if (backPath) router.push(backPath);
    else if (previousPath) router.push(previousPath);
    else router.back();
  };

  return (
    <>
      <ToastContainer />
      <Row className="align-items-center mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <button
              onClick={handleBack}
              className="btn btn-link text-dark p-0 me-2"
              style={{
                textDecoration: 'none',
                fontSize: '1.75rem',
                lineHeight: 1,
              }}
            >
              <ChevronLeft />
            </button>
            <h2 className="mb-0">{t(title || 'GO_BACK')}</h2>
          </div>
        </Col>
        {actions && <Col xs="auto">{actions}</Col>}
      </Row>
      <Container fluid className="p-2">
        {children}
      </Container>
    </>
  );
}
