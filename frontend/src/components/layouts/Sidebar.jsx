import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    ClipsboardList,
    Wallet,
    Settings
} from "lucide-react";

const Sidebar = () => {

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard 
        },
        {
            name: "Employees",
            path: "/admin/employees",
            icon: Users
        },
        {
            name: "Payroll",
            path: "/admin/payroll",
            icon: ClipsboardList
        },
        {
            name: "Report",
            path: "/admin/reports",
            icon: Wallet
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: Settings
        }
    ];

    return (
        <aside className="w-64 shrink-0 min-h-screen
                        bg-slate-900 text-white p-5">

            <h1 className="text-xl font-bold mb-8">
                Admin Panel
            </h1>

            <nav className="space-y-3">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink 
                            key={item.path}
                            to={item.path}
                            className={({ isActive}) => 
                                `flex items-center gap-3 p-3 rounded-lg
                                ${
                                    isActive
                                    ?"bg-blue-600"
                                    :"hover:bg-slate-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;