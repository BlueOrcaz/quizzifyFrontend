import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
    let role = localStorage.getItem('currentRole');


    return (
        role === '"Admin"' ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes