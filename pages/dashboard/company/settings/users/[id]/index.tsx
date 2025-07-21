import { toast } from 'react-toastify';

import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import {
  ArrowsExpand,
  BookmarkCheck,
  BookmarkDash,
  Pencil,
  Plus,
  Trash,
} from 'react-bootstrap-icons';

import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import ViewCard from '../../../../../../components/view-details/view-card';
import ViewDetails from '../../../../../../components/view-details/view-details';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffectAsync } from '../../../../../../utils/react';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { useAuth } from '../../../../../../hooks/use-auth';

import UserApi from '../../../../../api/user';
import { UserEntity } from '../../../../../../models/user/user.entity';
import { DeleteButton } from '../../../../../../components/buttons/delete-button';

export default function ViewUser({ id }) {
  const router = useRouter();

  const { t } = useTranslation();

  const { company, hasPermission } = useAuth();

  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);

  const backPath = '/dashboard/company/settings/users';

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  useEffectAsync(async () => {
    if (id) {
      const api = new UserApi();
      setLoading(true);

      try {
        const data = await api.findById(+id);
        if (data) {
          setUser(data);
        } else {
          toast.error(t('UNABLE_TO_FIND_{name}', { name: t('USER') }));
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

  const onEditClick = async () => {
    await router.push(router.asPath + `/edit`);
  };

  const onDeleteClick = async () => {
    if (!user) return;

    const api = new UserApi();
    await api.remove(user.id);
    await router.push(backPath);
  };

  const canEdit = hasPermission('CanUpdateUser');
  const canDelete = hasPermission('CanDeleteUser');

  return (
    <ChildPageLayout
      backPath={backPath}
      title={t('VIEW_{name}', { name: 'USER' }, { translateProps: true })}
      actions={
        !loading && user ? (
          <ButtonGroup>
            {canDelete && <DeleteButton onDelete={onDeleteClick} />}
            {canEdit && (
              <Button type="button" onClick={onEditClick}>
                <Pencil /> {t('EDIT')}
              </Button>
            )}
          </ButtonGroup>
        ) : undefined
      }
    >
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : user ? (
        <Row>
          <Col>
            <ViewDetails
              obj={{
                FIRST_NAME: user.first_name,
                LAST_NAME: user.last_name,
                EMAIL: user.email,
                phone: user.contact_number,
                phone_cell: user.cell_number,
                'Company Disabled': user.company_disabled ? 'Yes' : 'No',
              }}
            />
          </Col>
        </Row>
      ) : (
        <div className="text-center">
          <p>User not found</p>
        </div>
      )}
    </ChildPageLayout>
  );
}

ViewUser.getLayout = function getLayout(page) {
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
    console.error('ViewUser error:', error);
    return { props: { id: null } };
  }
}
