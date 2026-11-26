import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
    return (
        <div className="flex mn-h-screen">

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