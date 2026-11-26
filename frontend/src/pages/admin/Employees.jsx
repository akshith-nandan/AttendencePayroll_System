import { useEffect, useState} from "react";

import {
    getEmployees,
    createEmployees,
    updateEmployee,
    deactivateEmployee
} from "../../services/employeeServices";

const initialForm = {
    name: "",
    email: "",
    password: "",
    employeeId: "",
    designation: "",
    salary: ""
};

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchEmployees = async () => {
        try {
            setError("");

            const data = await getEmployees();
            setEmployees(data.employees ?? []);
        } catch (err) {
            setError(
                err.response?.data?.message || 
                "Failed to load employees"
            )
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdd = () => {
        setEditingId(null);
        setForm(initialForm);
        setShowForm(true);
    }

    const handleEdit = (employee)=> {
        setEditingId(employee._id);

        setForm({
            name: employee.name ?? "",
            email: employee.email ?? "",
            password: "",
            employeeId: employee.employeeId ?? "",
            designation: employee.designation ?? "",
            salary: employee.salary ?? ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try{
            if (editingId){
                await updateEmployee(editingId, {
                    name: form.name,
                    designation: form.designation
                });
            } else {
                await createEmployees({
                    ...form,
                    salary: Number(form.salary)
                });
            }

            setShowForm(false);
            setEditingId(null);
            setForm(initialForm);

            await fetchEmployees();
        } catch (err){
            setError(
                err.response?.data?.message ||
                "Failed to save Employee"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this employee?"
        );

        if (!confirmed) return;

        try{
            await deactivateEmployee(id);
            await fetchEmployees();
        } catch (err){
            setError(
                err.response?.data?.message || 
                "Failed to deactivate employee"
            );
        }
    };

    const filteredEmployees = employees.filter((emp) => {
        const keyword = search.toLowerCase();

        return(
            (emp.name ?? "").toLowerCase().includes(keyword) ||
            (emp.email ?? "").toLowerCase().includes(keyword) ||
            (emp.employeeId ?? "").toLowerCase().includes(keyword)
        );
    });

    if (loading) {
        return <p className="p-6">Loading employees...</p>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Employee Management
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Employee
                </button>
            </div>

            {error && (
                <p className="text-red-600 mb-4">{error}</p>
            )}

            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employees"
                className="w-full border p-3 mb-4 rounded"
            />

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-5 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {[
                        ["name", "Name"],
                        ["email", "Email"],
                        ["employeeId", "Employee ID"],
                        ["designation", "Designation"],
                        ["salary", "Salary"]
                    ].map(([field, label]) => (
                        <input
                            key={field}
                            type={field === "email" ? "email" : field === "salary" ? "number" : "text"}
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            placeholder={label}
                            disabled={editingId && field === "email"}
                            className="border p-3 rounded"
                            required
                        />
                    ))}

                    {!editingId && (
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="border p-3 rounded"
                            minLength={8}
                            required
                        />
                    )}

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {saving ? "Saving..." : editingId ? "Update" : "Create"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setForm(initialForm);
                            }}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Employee ID</th>
                            <th className="p-3 text-left">Designation</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee._id} className="border-t">
                                <td className="p-3">{employee.name}</td>
                                <td className="p-3">{employee.email}</td>
                                <td className="p-3">{employee.employeeId}</td>
                                <td className="p-3">{employee.designation}</td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(employee)}
                                            className="text-blue-600"
                                        >
                                            Edit
                                        </button>
                                        {employee.isActive !== false && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeactivate(employee._id)}
                                                className="text-red-600"
                                            >
                                                Deactivate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                    <p className="p-6 text-center text-gray-500">No employees found.</p>
                )}
            </div>
        </div>
    )
};

export default Employees;