import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import { UserForm } from '../../../../../../components/forms/company/user-form';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import { AdminPasswordResetModal } from '../../../../../../components/users/AdminPasswordResetModal';
import { useAuth } from '../../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { UserEntity } from '../../../../../../models/user/user.entity';
import { useEffectAsync } from '../../../../../../utils/react';
import UserApi from '../../../../../api/user';

export default function EditUser({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const { company } = useAuth();

  const backPath = `/dashboard/company/settings/users/${id}`;

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffectAsync(async () => {
    if (id) {
      const api = new UserApi();
      setLoading(true);

      try {
        const entity = await api.findById(+id);
        if (entity) {
          setUser(entity);
        } else {
          toast.error(t('UNABLE_TO_FIND_{name}', { name: 'USER' }, { translateProps: true }));
          goBack();
        }
      } catch (e) {
        // silent error for now
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'USER' }, { translateProps: true }));
        goBack();
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'USER' }, { translateProps: true }));
      goBack();
    }
  }, [id]); // Only depend on id, not user

  return (
    <ChildPageLayout
      title={t('EDIT_{name}', { name: 'USER' }, { translateProps: true })}
      backPath={backPath}
    >
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <UserForm
            entity={user}
            onSaveComplete={goBack}
          />

          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Password Reset</h6>
                <p className="text-muted small mb-0">
                  Send a reset email or set a temporary password on behalf of this user.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowPasswordReset(true)}
              >
                Reset Password
              </button>
            </div>
          </div>

          <AdminPasswordResetModal
            user={user}
            show={showPasswordReset}
            onHide={() => setShowPasswordReset(false)}
          />
        </>
      )}
    </ChildPageLayout>
  );
}

EditUser.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    if (!id) return { notFound: true };

    return {
      props: { id: id },
    };
  } catch (error) {
    console.error('EditUser error:', error);
    return { props: { id: null } };
  }
}
