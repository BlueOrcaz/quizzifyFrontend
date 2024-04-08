import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    let role = localStorage.getItem('currentRole');
    return (
        role === '"User"' ? <Outlet/> : <Navigate to="/login"/> 
    )
}

export default PrivateRoutes