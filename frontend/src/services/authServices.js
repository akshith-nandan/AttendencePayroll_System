import api from "./api";

export const loginUSer = async(email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    return response.data;
};

export const getCurrentUSer = async() => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}