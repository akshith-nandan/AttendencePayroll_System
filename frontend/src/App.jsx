import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/layouts/ProtectedRoute";

import AdminLayout from "./components/layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import Reports from "./pages/admin/Reports";
import Payroll from "./pages/admin/Payroll";
import Settings from "./pages/admin/Settings";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login/>} />

            <Route path="/unauthorized"
                    element={<h1>Access Denied</h1>}/>

            <Route element={
                <ProtectedRoute allowedRoles={["admin"]}/>
            }>
                <Route path="/admin" element={<AdminLayout/>}>

                    <Route
                        path="dashboard"
                        element={<AdminDashboard/>}
                    />

                    <Route
                        path="employees"
                        element= {<Employees />}
                    />
                    <Route
                        path="payroll"
                        element= {<Payroll />}
                    />

                    <Route
                        path="reports"
                        element= {<Reports />}
                    />

                    <Route
                        path="settings"
                        element= {<Settings/>}
                    />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;