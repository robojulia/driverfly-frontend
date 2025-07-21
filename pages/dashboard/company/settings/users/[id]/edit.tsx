import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import { UserForm } from '../../../../../../components/forms/company/user-form';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
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
        <UserForm
          entity={user}
          onSaveComplete={goBack}
          // onSaveError={goBack}
        />
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
