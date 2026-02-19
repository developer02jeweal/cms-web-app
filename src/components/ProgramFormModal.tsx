import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function ProgramFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    currentVersion: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        code: initialData.code || "",
        description: initialData.description || "",
        category: initialData.category || "",
        currentVersion: initialData.currentVersion || "",
      });
    } else {
      setForm({
        name: "",
        code: "",
        description: "",
        category: "",
        currentVersion: "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {initialData ? "Edit Program" : "Create Program"}
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Program Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
          />

          <input
            name="code"
            placeholder="Program Code"
            value={form.code}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
          />

          <input
            name="currentVersion"
            placeholder="Version"
            value={form.currentVersion}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
