import api from "./api";

export const getEmployees = async () => {
    const response = await api.get("/employees");
    return response.data;
};

export const createEmployees = async (data) => {
    const response = await api.post("/employees",data);
    return response.data;
};

export const updateEmployees = async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
};

export const deactivateEmployee = async (id) => {
    const response = await api.delete(`/employees/${id}`)
    return response.data;
};