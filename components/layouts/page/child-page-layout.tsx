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
  backPathTitle?: string;
}

export default function ChildPageLayout({
  title,
  backPath,
  backPathTitle,
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
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center me-3"
              style={{
                fontSize: '0.875rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
              }}
            >
              <ChevronLeft className="me-1" style={{ fontSize: '1rem' }} />
              {backPathTitle || t('Back')}
            </button>

            {/* Page Title */}
            {title && (
              <h2 className="mb-0" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                {t(title)}
              </h2>
            )}
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
