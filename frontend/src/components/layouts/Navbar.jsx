import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true })
    };

    return (
        <nav className="flex justify-between p-4 bg-white shadow">
            <h2>Attendence & PAyroll System</h2>

            <div className="flex items-center gap-4">
                <span>
                    Welcome, {user?.name}
                </span>

                <button
                    onClick={handleLogout}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;