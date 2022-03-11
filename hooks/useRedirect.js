import useAuth from './useAuth';
import { useRouter } from 'next/router'
import { useEffect } from 'react';

const useRedirect = () => {

    const { isDriver, isCompany } = useAuth();

    const router = useRouter()

    const authDriver = () => {
        useEffect(() => {
            if (!isDriver()) {
                router.push('/')
            }
        });
    }

    const authCompany = () => {
        useEffect(() => {
            if (!isCompany()) {
                router.push('/')
            }
        });
    }

    return {
        authDriver,
        authCompany,
    };
};


export default useRedirect;
