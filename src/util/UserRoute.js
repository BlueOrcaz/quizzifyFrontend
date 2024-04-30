import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    let role = localStorage.getItem('currentRole');
    return ( // if the current role is a user, it means that they are logged in so they can access useronly pages.
        role === '"User"' ? <Outlet/> : <Navigate to="/login"/> 
    )
}

export default PrivateRoutes