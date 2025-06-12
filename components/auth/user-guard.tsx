import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { yupInit } from '../../config/yup';
import { jwtExpiryTimeout, useAuth } from '../../hooks/use-auth';
import { Loading } from '../loading/loading';
import { useTranslation } from '../../hooks/use-translation';

export interface UserGuardProps {
  permissions?: string | string[];
  readonly children: React.ReactChildren | React.ReactChild;
}

export function UserGuard({ permissions, children }: UserGuardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  yupInit(t);

  const { user, hasPermission, loginGuard } = useAuth();

  const [timeoutId, setTimeoutId] = useState(null);

  function destructor() {
    if (timeoutId) window.clearTimeout(timeoutId);
  }

  async function CheckAuth() {
    // console.log("Checking Auth...");
    if (await loginGuard()) {
      if (permissions) {
        if (user) {
          if (typeof permissions == 'string') permissions = [permissions];

          if (!hasPermission(...permissions)) {
            router.push('/');
            return false;
          }
        } else return false;
      }

      if (user) {
        // HF, temporarily disable this redirect until notification service is fixed
        if (false && user.emailTokenTimestamp) {
          if (router.asPath.startsWith('/dashboard')) {
            router.push('/login/verify-email');
            return false;
          }
        }

        // HF, temporarily disable phone verification until sms is online
        if (false && user.phoneTokenTimestamp) {
          if (router.asPath.startsWith('/dashboard')) {
            router.push('/login/verify-phone');
            return false;
          }
        }
        if (user.jwt?.exp) {
          const msToExpiration = jwtExpiryTimeout(user.jwt);
          // console.log("Expires in ms: ", msToExpiration);

          const timeoutId = window.setTimeout(CheckAuth, msToExpiration);

          setTimeoutId(timeoutId);
        }
      }
    }

    return true;
  }

  return (
    <Loading
      fetch={CheckAuth}
      triggers={[user, router.asPath]}
      destructor={destructor}
      loadingText={'Checking authorization...'}
    >
      {children}
    </Loading>
  );
}
