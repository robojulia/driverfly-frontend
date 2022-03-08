import useStorage from './useStorage';

const useAuth = () => {

    const { getItem, setItem, removeItem } = useStorage();

    const authCheck = () => {
        return getItem('user') ? getItem('user') : false;
    }

    const setAuth = (user) => {
        return setItem('user', user);
    }

    const removeAuth = () => {
        return removeItem('user')
    }

    return {
        authCheck,
        setAuth,
        removeAuth,
    };
};


export default useAuth;
