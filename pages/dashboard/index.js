const Dashboard = () => {
    const logout = () => {
        window.localStorage.removeItem('userData')
    }

    return (
        <>
            <button className="btn btn" onClick={logout}>Logout</button>
        </>
    )
};

export default Dashboard

