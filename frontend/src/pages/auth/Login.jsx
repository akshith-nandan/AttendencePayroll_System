import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await login(email, password);

            if (data.role === "admin"){
                navigate("/admin/dashboard", { replace: true});
            } else {
                navigate("/employee/dashboard", { replace: true});
            }
        }catch (err){
            setError(
                err.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading (false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
            onSubmit = {handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md w-96"
            >
                <h1 className="text-2xl font-blod mb-6">
                    Attendence & Payroll Login
                </h1>

                {error && (
                    <p className="text-red-600 mb-4">
                        {error}
                    </p>
                )}

                <input
                   type="email"
                   placeholder="Email"
                   className="w-full border p-3 mb-4 rounded"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                />

                <input
                   type="password"
                   placeholder="Password"
                   className="w-full border p-3 mb-4 rounded"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                />

                <button 
                   type="submit"
                   disabled={loading}
                   className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-50"
                >
                    {loading ? "Logging in...": "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;