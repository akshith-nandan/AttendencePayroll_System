import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    getCurrentUser,
    logoutUser
} from "../services/authService"

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const checkAuth = async() => {
            try {
                const token = localStorage.getItem("token");

                if (!token){
                    return;
                }

                const data = await getCurrentUser();

                if (active) {
                    setUser(data.user ?? data);
                }
            }catch ( error ){
                localStorage.removeItem("token");

                if (active) {
                    setUser(null);
                }
            }finally{
                if (active){
                    setLoading(false);
                }
            }
        };
        checkAuth();

        return () => {
            active = false;
        };
    }, []);

    const login = async(email,password) =>{
        const data = await loginUser(email,password);

        if (!data.token || !data.user) {
            throw new Error("Invalid login response");
        }

        localStorage.setItem("token", data.token);

        setUser(data.user);

        return data.user;
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider  
          value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated: !!user
          }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context){
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }
    
    return context;
}