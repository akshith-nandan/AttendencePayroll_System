import { Outlet, Navigate} from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if ( !user ){
        return <Navigate to="/login" replace />;
    } 

    if (!allowedRoles.include(user.role)){
        return <Navigate to="/unauthorized" replace/>;
    }

    return <Outlet/>;
};

export default ProtectedRoute;
