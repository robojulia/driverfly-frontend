import useStorage from './useStorage';

const useAuth = () => {

    const { getItem, setItem } = useStorage();

    const authCheck = () => {
        return getItem('token') ? getItem('token') : false;
    }

    const setAuth = (token) => {
        return setItem('token', token);
    }

    const removeAuth = () => {
        return removeItem('token');
    }

    return {
        authCheck,
        setAuth,
        removeAuth,
    };
};


export default useAuth;
