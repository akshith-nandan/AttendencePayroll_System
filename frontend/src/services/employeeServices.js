import api from "./api";

export const getEmployees = async () => {
    const response = await api.get("/employee");
    return response.data;
};

export const createEmployees = async (data) => {
    const response = await api.post("/employee",data);
    return response.data;
};

export const updateEmployee = async (id, data) => {
    const response = await api.put(`/employee/${id}`, data);
    return response.data;
};

export const deactivateEmployee = async (id) => {
    const response = await api.patch(`/employee/${id}/deactivate`);
    return response.data;
};