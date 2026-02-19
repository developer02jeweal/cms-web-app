import { useEffect, useState } from "react";
import {
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
} from "@/api/programService";
import ProgramFormModal from "@/components/ProgramFormModal";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function Programs() {
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);

            const data = await getPrograms();
            setPrograms(data || []);

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to load programs"
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
                await updateProgram(selected._id, payload);
                toast.success("Program updated successfully");
            } else {
                await createProgram(payload);
                toast.success("Program created successfully");
            }

            setShowForm(false);
            setSelected(null);
            load();

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to save program"
            );
        }
    };


    const handleDelete = async () => {
        try {
            if (!deleteId) return;

            await deleteProgram(deleteId);

            toast.success("Program deleted successfully");

            setDeleteId(null);
            load();

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to delete program"
            );
        }
    };


    return (
        <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Programs
                </h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow"
                >
                    + Add Program
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {programs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                            <div className="text-6xl mb-4">🧩</div>
                            <p>No Programs Found</p>
                        </div>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-6 py-4 text-left">Name</th>
                                    <th className="px-6 py-4 text-left">Code</th>
                                    <th className="px-6 py-4 text-left">Category</th>
                                    <th className="px-6 py-4 text-left">Version</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((p, index) => (
                                    <tr
                                        key={p._id}
                                        className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-6 py-4">{p.name}</td>
                                        <td className="px-6 py-4">{p.code}</td>
                                        <td className="px-6 py-4">{p.category}</td>
                                        <td className="px-6 py-4">{p.currentVersion}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => {
                                                    setSelected(p);
                                                    setShowForm(true);
                                                }}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleteId(p._id)}
                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            <ProgramFormModal
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
                message="Are you sure you want to delete this program?"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
