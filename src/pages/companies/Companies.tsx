import { useEffect, useState } from "react";
import {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
} from "@/api/companyService";
import CompanyFormModal from "@/components/CompanyFormModal";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function Companies() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);

            const data = await getCompanies();
            setCompanies(data || []);

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to load companies"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        load();
    }, []);

    const handleSave = async (data: any) => {
        try {
            const payload = { ...data };
            delete payload._id;

            if (selected) {
                await updateCompany(selected._id, payload);
                toast.success("Company updated successfully");
            } else {
                await createCompany(payload);
                toast.success("Company created successfully");
            }

            setShowForm(false);
            setSelected(null);
            load();

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to save company"
            );
        }
    };



    const handleDelete = async () => {
        try {
            if (!deleteId) return;

            await deleteCompany(deleteId);

            toast.success("Company deleted successfully");

            setDeleteId(null);
            load();

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to delete company"
            );
        }
    };


    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-semibold">Companies</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + Add Company
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    {companies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="text-5xl mb-4">🏢</div>
                            <p className="text-lg font-medium">No Companies Found</p>
                            <p className="text-sm mt-1">
                                Click "Add Company" to create your first company.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Company Name</th>
                                        <th className="px-6 py-4 text-left">Email</th>
                                        <th className="px-6 py-4 text-left">Country</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {companies.map((c, index) => (
                                        <tr
                                            key={c._id}
                                            className={`hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {c.companyName}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {c.companyEmail}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {c.country || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setSelected(c);
                                                        setShowForm(true);
                                                    }}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => setDeleteId(c._id)}
                                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}


            <CompanyFormModal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelected(null);
                }}
                onSubmit={handleSave}
                initialData={selected}
            />

            <ConfirmModal
                isOpen={!!deleteId}
                title="Confirm Delete"
                message="Are you sure you want to delete this company?"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
