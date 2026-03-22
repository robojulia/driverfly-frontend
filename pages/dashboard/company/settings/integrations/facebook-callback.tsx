import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from 'reactstrap';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';

/**
 * Landing page after the Facebook OAuth flow completes.
 * The backend handles the actual code exchange at /api/fb-leads/facebook/callback
 * and redirects here with a `success` query param so we can show the user feedback.
 */
export default function FacebookCallback() {
  const router = useRouter();

  useEffect(() => {
    // Give the user a moment to read the status, then redirect to the integration page
    const t = setTimeout(() => {
      router.replace('/dashboard/company/settings/integrations/facebook');
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const { success, error } = router.query;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      {error ? (
        <>
          <div className="text-danger fs-4 mb-2">Connection failed</div>
          <p className="text-muted">{String(error)}</p>
        </>
      ) : (
        <>
          <Spinner color="primary" className="mb-3" />
          <div className="fs-5">Facebook connected! Redirecting…</div>
        </>
      )}
    </div>
  );
}

FacebookCallback.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
