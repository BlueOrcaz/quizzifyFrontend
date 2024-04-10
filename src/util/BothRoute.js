import { Navigate, Outlet } from 'react-router-dom'

const BothRoutes = () => {
    let role = localStorage.getItem('currentRole');
    return (
        role === '"User"' || role === '"Admin"' ? <Outlet/> : <Navigate to="/login"/> 
    )
}

export default BothRoutes