import { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { EnvelopeFill, KeyFill } from 'react-bootstrap-icons';

import { UserEntity } from '../../models/user/user.entity';
import UserApi from '../../pages/api/user';
import AuthApi from '../../pages/api/auth';
import BaseInput from '../forms/base-input';
import { useTranslation } from '../../hooks/use-translation';

interface Props {
  user: UserEntity | null;
  show: boolean;
  onHide: () => void;
}

export function AdminPasswordResetModal({ user, show, onHide }: Props) {
  const { t } = useTranslation();
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setSendingEmail(true);
    try {
      const api = new AuthApi();
      await api.forgotPassword({ email: user.email });
      toast.success(t('PASSWORD_RESET_EMAIL_SENT'));
      handleHide();
    } catch {
      toast.error(t('UNABLE_TO_SEND_PASSWORD_RESET_EMAIL'));
    } finally {
      setSendingEmail(false);
    }
  };

  const form = useFormik({
    initialValues: { password: '', passwordConfirm: '' },
    validationSchema: yup.object({
      password: yup
        .string()
        .min(8, 'PASSWORD_REQUIREMENT_LENGTH')
        .matches(/\d/, 'PASSWORD_REQUIREMENT_NUMBER')
        .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, 'PASSWORD_REQUIREMENT_SPECIAL_CHARACTER')
        .required(),
      passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'PASSWORDS_DO_NOT_MATCH')
        .required(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!user?.id) return;
      try {
        const api = new UserApi();
        await api.adminSetPassword(user.id, values.password);
        toast.success(t('PASSWORD_UPDATED_SUCCESSFULLY'));
        resetForm();
        handleHide();
      } catch {
        toast.error(t('UNABLE_TO_UPDATE_PASSWORD'));
      }
    },
  });

  const handleHide = () => {
    form.resetForm();
    onHide();
  };

  const displayName = user?.name || user?.email || '';

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1.1rem' }}>
          Reset Password — <span className="text-muted fw-normal">{displayName}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {/* Option 1: Send reset email (preferred) */}
        <div className="p-3 rounded border mb-4">
          <div className="d-flex align-items-center gap-2 mb-1">
            <EnvelopeFill className="text-primary" />
            <h6 className="mb-0">Send Password Reset Email</h6>
            <span className="badge bg-primary ms-auto" style={{ fontSize: '0.7rem' }}>Recommended</span>
          </div>
          <p className="text-muted small mb-3">
            Sends a reset link to <strong>{user?.email}</strong>. The user sets their own
            password — more secure since you never handle their credentials.
          </p>
          <Button
            variant="primary"
            onClick={handleSendResetEmail}
            disabled={sendingEmail}
          >
            {sendingEmail ? (
              <><Spinner size="sm" className="me-2" />Sending…</>
            ) : (
              'Send Reset Email'
            )}
          </Button>
        </div>

        <div className="d-flex align-items-center gap-2 my-3">
          <hr className="flex-grow-1 m-0" />
          <span className="text-muted small px-2">or set a temporary password directly</span>
          <hr className="flex-grow-1 m-0" />
        </div>

        {/* Option 2: Set temporary password (escape hatch) */}
        <div className="p-3 rounded border">
          <div className="d-flex align-items-center gap-2 mb-1">
            <KeyFill className="text-warning" />
            <h6 className="mb-0">Set Temporary Password</h6>
          </div>
          <p className="text-muted small mb-3">
            Use this if the user can't access their email. Tell the user to log in with this
            password and change it immediately afterward.
          </p>
          <form onSubmit={form.handleSubmit}>
            <BaseInput
              className="mb-2"
              label="New Temporary Password"
              name="password"
              type="password"
              required
              formik={form}
            />
            <BaseInput
              className="mb-3"
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
              required
              formik={form}
            />
            <Button
              type="submit"
              variant="warning"
              disabled={form.isSubmitting}
              className="w-100"
            >
              {form.isSubmitting ? (
                <><Spinner size="sm" className="me-2" />Setting Password…</>
              ) : (
                'Set Temporary Password'
              )}
            </Button>
          </form>
        </div>

      </Modal.Body>
    </Modal>
  );
}
