import { useState } from "react";
import { loginAPI } from "@/api/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await loginAPI(form);

            // ถ้า backend return accessToken
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);

            navigate("/"); // ไปหน้า Home
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%)]"></div>

            <div className="relative w-full flex flex-col md:flex-row">
                <div className="md:w-1/2 w-full flex items-center justify-center text-white px-10 py-16 md:py-0">
                    <div className="max-w-md">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Center Management System
                        </h1>
                        <p className="mt-6 text-blue-100 leading-relaxed text-sm md:text-base">
                            Securely manage company programs and internal systems.
                        </p>
                    </div>
                </div>

                <div className="md:w-1/2 w-full flex items-center justify-center px-6 py-12 md:px-12">
                    <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                            Sign in
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-800"
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-950 transition duration-300"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-10 text-xs text-gray-400 text-center">
                            © {new Date().getFullYear()} Company Internal System
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
