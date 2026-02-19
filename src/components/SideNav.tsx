import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "@/api/authService";

interface Props {
  active: string;
  setActive: (tab: string) => void;
}

export default function SideNav({ active, setActive }: Props) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { name: "Companies", icon: "🏢" },
    { name: "Programs", icon: "🧩" },
    { name: "Instances", icon: "📦" },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logoutAPI(); // call backend logout

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      // fallback remove token
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/login");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="h-screen w-64 bg-blue-950 text-white flex flex-col shadow-xl">
        
        {/* Logo / Header */}
        <div className="px-6 py-6 border-b border-blue-800">
          <h2 className="text-xl font-semibold tracking-wide">
            CMS Dashboard
          </h2>
          <p className="text-xs text-blue-300 mt-1">
            Center Management System
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-3 py-6 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActive(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active === tab.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">
                {tab.name}
              </span>
            </button>
          ))}
        </div>

        {/* Logout Section */}
        <div className="px-4 py-4 border-t border-blue-800">
          <button
            onClick={() => setShowModal(true)}
            className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-3">
              Confirm Logout
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
