import api from "./api";

export const getDailyReport = async (date) => {
    const response = await api.get("/reports/daily", {
        params: { date }
    });

    return response.data;
};

export const getWeeklyReport = async (startDate) => {
    const response = await api.get("/reports/weekly", {
        params: { startDate }
    });

    return response.data;
};

export const getMontlyReport = async (month, year) => {
    const response = await api.get("/reports/monthly", {
        params: { month, year }
    });

    return response.data;
};

export const getEmployeeReport = async (
    employeeId,
    startDate,
    endDate
) => {
    const response = await api.get(`/reports/employee/${employeeId}`,
        {
            params: { startDate, endDate }
        }
    );

    return response.data;
};