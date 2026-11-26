import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen">

            <Sidebar/>

            <div className="flex-1 min-w-0 bg-gray-100">

                <Navbar/>

            </div>

            <main>
                <Outlet/>
            </main>
        </div>
    );
};

export default AdminLayout;