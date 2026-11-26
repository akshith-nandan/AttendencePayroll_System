import api from "./api";

export const getDailyReport = async (date) => {
    const response = await api.get("/report/daily", {
        params: { date }
    });

    return response.data;
};

export const getWeeklyReport = async (startDate) => {
    const response = await api.get("/report/weekly", {
        params: { startDate }
    });

    return response.data;
};

export const getMontlyReport = async (month, year) => {
    const response = await api.get("/report/monthly", {
        params: { month, year }
    });

    return response.data;
};

export const getEmployeeReport = async (
    employeeId,
    startDate,
    endDate
) => {
    const response = await api.get(`/report/employee/${employeeId}`,
        {
            params: { startDate, endDate }
        }
    );

    return response.data;
};