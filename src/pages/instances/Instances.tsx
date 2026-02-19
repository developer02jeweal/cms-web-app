import { useEffect, useState } from "react";
import QRCode from "qrcode";

import {
    getInstances,
    createInstance,
    updateInstance,
    deleteInstance,
} from "@/api/instanceService";
import { getCompanies } from "@/api/companyService";
import { getPrograms } from "@/api/programService";
import InstanceFormModal from "@/components/InstanceFormModal";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { encryptQR } from "@/utils/qrEncrypt";

export default function Instances() {
    const [instances, setInstances] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    /* ================= HELPER ================= */

    const getDaysLeft = (expireDate: string) => {
        const diff =
            new Date(expireDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    /* ================= LOAD DATA ================= */

    const load = async () => {
        try {
            setLoading(true);

            const [i, c, p] = await Promise.all([
                getInstances(),
                getCompanies(),
                getPrograms(),
            ]);

            setInstances(i || []);
            setCompanies(c || []);
            setPrograms(p || []);

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to load data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    /* ================= SAVE ================= */

    const handleSave = async (data: any) => {
        try {
            const payload = {
                ...data,
                licenseStart: data.licenseStart
                    ? new Date(data.licenseStart)
                    : null,
                licenseExpire: data.licenseExpire
                    ? new Date(data.licenseExpire)
                    : null,
            };

            delete payload._id;

            if (!payload.licenseStart || !payload.licenseExpire) {
                toast.error("License dates are required");
                return;
            }

            if (selected) {
                await updateInstance(selected._id, payload);
                toast.success("Instance updated successfully");
            } else {
                await createInstance(payload);
                toast.success("Instance created successfully");
            }

            setShowForm(false);
            setSelected(null);
            load();

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to save instance"
            );
        }
    };


    /* ================= DELETE ================= */

    const handleDelete = async () => {
        try {
            if (!deleteId) return;

            await deleteInstance(deleteId);
            toast.success("Instance deleted successfully");

            setDeleteId(null);
            load();

        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to delete instance"
            );
        }
    };
    const handleDownloadQR = async (instance: any) => {
        try {
            const rawData = JSON.stringify({
                program: instance.program?.name,
                code: instance.program?.code,
                apiUrl: instance.apiUrl,
                username: instance.apiUsername,
            });

            const encrypted = encryptQR(rawData);

            const url = await QRCode.toDataURL(encrypted, {
                width: 300,
                margin: 2,
            });

            const link = document.createElement("a");
            link.href = url;
            link.download = `${instance.program?.name}_QR.png`;
            link.click();

            toast.success("Encrypted QR downloaded");

        } catch (err) {
            console.error(err);
            toast.error("Failed to generate QR");
        }
    };


    /* ================= UI ================= */

    return (
        <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-semibold">Program Instances</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + Add Instance
                </button>

            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    {instances.length === 0 ? (
                        <div className="text-center py-24 text-gray-400">
                            <div className="text-6xl mb-4">📦</div>
                            No Instances Found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">

                                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Company</th>
                                        <th className="px-6 py-4 text-left">Program</th>
                                        <th className="px-6 py-4 text-left">License</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {instances.map((i, index) => {
                                        const daysLeft = getDaysLeft(i.licenseExpire);

                                        return (
                                            <tr
                                                key={i._id}
                                                className={`transition hover:bg-blue-50 ${index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                                    }`}
                                            >
                                                {/* Company */}
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {i.company?.companyName}
                                                </td>

                                                {/* Program */}
                                                <td className="px-6 py-4 text-gray-600">
                                                    {i.program?.name}
                                                </td>

                                                {/* License */}
                                                <td className="px-6 py-4 text-gray-600">
                                                    {i.licenseStart?.slice(0, 10)} →{" "}
                                                    {i.licenseExpire?.slice(0, 10)}

                                                    {daysLeft <= 7 && daysLeft > 0 && (
                                                        <span className="ml-2 text-xs text-orange-500 font-medium">
                                                            ⚠ Expiring Soon ({daysLeft} days)
                                                        </span>
                                                    )}

                                                    {daysLeft <= 0 && (
                                                        <span className="ml-2 text-xs text-red-600 font-medium">
                                                            Expired
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 text-xs rounded-full font-medium ${i.status === "active"
                                                            ? "bg-green-100 text-green-600"
                                                            : i.status === "expired"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-yellow-100 text-yellow-600"
                                                            }`}
                                                    >
                                                        {i.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right space-x-2 flex items-end justify-center">

                                                    <button
                                                        onClick={() => {
                                                            setSelected(i);
                                                            setShowForm(true);
                                                        }}
                                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => setDeleteId(i._id)}
                                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                    >
                                                        Delete
                                                    </button>

                                                    <button
                                                        onClick={() => handleDownloadQR(i)}
                                                        className="px-3 py-1.5 bg-sky-100 rounded-lg hover:bg-sky-200 transition "
                                                    >
                                                        <img
                                                            src="/qrcode-svgrepo-com.svg"
                                                            className="w-5 h-5"
                                                            alt="QR Code"
                                                        />
                                                    </button>

                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Form Modal */}
            <InstanceFormModal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelected(null);
                }}
                onSubmit={handleSave}
                initialData={selected}
                companies={companies}
                programs={programs}
            />

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={!!deleteId}
                title="Confirm Delete"
                message="Are you sure you want to delete this instance?"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />

        </div>
    );
}
