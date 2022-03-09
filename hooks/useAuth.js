import useStorage from './useStorage';

const useAuth = () => {

    const { getItem, setItem, removeItem } = useStorage();

    const authCheck = () => {
        return getItem('user') ? JSON.parse(getItem('user')) : false;
    }

    const setAuth = (user) => {
        return setItem('user', JSON.stringify(user));
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
