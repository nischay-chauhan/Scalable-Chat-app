import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, MessageSquare } from "lucide-react";
import { Background } from "@/components/shared/Background";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        const success = await login(formData);
        if (success) {
            toast.success(`Welcome back, ${formData.username}!`);
            navigate("/chat");
        } else {
            toast.error(error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-white">
            <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 bg-slate-950 border-r border-white/5">
                <Background />

                <div className="relative z-10 text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-4 rounded-2xl w-fit mb-8">
                            <MessageSquare className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Welcome back to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                ChatApp
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Connect with friends, colleagues, and communities in real-time. Your conversations, reimagined.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-slate-900">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Sign in</h2>
                        <p className="text-slate-400">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-base text-slate-300">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="h-12 text-lg bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-base text-slate-300">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="h-12 text-lg bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
