import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployees } from "../../services/employeeServices";
import { getDailyReport } from "../../services/reportServices";

const AdminDashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({
        totalEmployees: 0,
        present: 0,
        notCheckedIn: 0,
        shortHours: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Intl.DateTimeFormat("en-CA", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }).format(new Date());

                const [employeeData, reportData] = 
                    await Promise.all([
                        getEmployees(),
                        getDailyReport(today)
                    ]);

                const employees = employeeData.employees;

                const attendence = reportData.records;

                const activeEmployees = employees.filter(
                    (employee) => employee.isActive !== false
                );

                const activeIds = new Set(
                    activeEmployees.map((employee) => employee.id)
                );

                const activeAttendence = attendence.filter(
                    (record) => activeIds.has(
                        record.employee?._id ?? record.employee
                    )
                );

                const present = activeAttendence.filter(
                    (record) => record.status === "present"
                ).length;

                const shortHours = activeAttendence.filter(
                    (record) => record.status === "short-Hours"
                ).length;

                const checkedInIds = new Set(
                    activeAttendence.map(
                        (record) => record.employee?._id ?? record.employee
                    )
                );

                setStats({
                    totalEmployees: activeEmployees.length,
                    present,
                    shortHours,
                    notCheckedIn:
                        activeEmployees.length - checkedInIds.size
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">
                Admin Dashboard
            </h1>

            <p className="text-grey-500 mt-2">
                Welcome, {user?.name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-4 gap-6 mt-6">

                <div className="bg-white shadow rounded-xl p-6">
                    <h2>Total Employees</h2>
                    <p className="text-3xl font-bold text-blue-600">
                        {stats.totalEmployees}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2>Present</h2>
                    <p className="text-3xl font-bold text-green-600">
                        {stats.present}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2>Not Checked In</h2>
                    <p className="text-3xl font-bold text-red-600">
                        {stats.notCheckedIn}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h2>Short-Hours</h2>
                    <p className="text-3xl font-bold text-orange-600">
                        {stats.shortHours}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;