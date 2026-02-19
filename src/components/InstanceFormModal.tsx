import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  companies: any[];
  programs: any[];
}

export default function InstanceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  companies,
  programs,
}: Props) {
  const [form, setForm] = useState({
    company: "",
    program: "",
    licenseStart: "",
    licenseExpire: "",
    apiUrl: "",
    apiUsername: "",
    apiPassword: "",
    status: "active",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company?._id || "",
        program: initialData.program?._id || "",
        licenseStart: initialData.licenseStart?.slice(0, 10) || "",
        licenseExpire: initialData.licenseExpire?.slice(0, 10) || "",
        apiUrl: initialData.apiUrl || "",
        apiUsername: initialData.apiUsername || "",
        apiPassword: "",
        status: initialData.status || "active",
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      company: "",
      program: "",
      licenseStart: "",
      licenseExpire: "",
      apiUrl: "",
      apiUsername: "",
      apiPassword: "",
      status: "active",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  if (!form.licenseStart || !form.licenseExpire) {
    return;
  }

  setSaving(true);
  await onSubmit(form);
  setSaving(false);
};


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-6">
          {initialData
            ? "Edit Program Instance"
            : "Create Program Instance"}
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {/* Company */}
          <div>
            <label className="text-sm text-gray-600">
              Company
            </label>
            <select
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Program */}
          <div>
            <label className="text-sm text-gray-600">
              Program
            </label>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* License Start */}
          <div>
            <label className="text-sm text-gray-600">
              License Start
            </label>
            <input
              type="date"
              name="licenseStart"
              value={form.licenseStart}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          {/* License Expire */}
          <div>
            <label className="text-sm text-gray-600">
              License Expire
            </label>
            <input
              type="date"
              name="licenseExpire"
              value={form.licenseExpire}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          {/* API URL */}
          <div className="col-span-2">
            <label className="text-sm text-gray-600">
              API URL
            </label>
            <input
              type="text"
              name="apiUrl"
              value={form.apiUrl}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="https://api.company.com"
            />
          </div>

          {/* API Username */}
          <div>
            <label className="text-sm text-gray-600">
              API Username
            </label>
            <input
              type="text"
              name="apiUsername"
              value={form.apiUsername}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* API Password */}
          <div>
            <label className="text-sm text-gray-600">
              API Password
            </label>
            <input
              type="password"
              name="apiPassword"
              value={form.apiPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder={
                initialData
                  ? "Leave blank to keep current"
                  : ""
              }
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : initialData
              ? "Update"
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
