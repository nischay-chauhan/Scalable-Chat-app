import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Lock, Users } from "lucide-react";
import { Background } from "@/components/shared/Background";
import { Navbar } from "@/components/shared/Navbar";

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-indigo-500/30">
            <Background />
            <Navbar />

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] text-center px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    v2.0 is now live
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight max-w-4xl"
                >
                    Connect Instantly, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Chat Without Limits
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
                >
                    Experience the future of communication with our secure, fast, and intuitive chat platform.
                    Built for teams, communities, and friends.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link to="/register">
                        <Button size="lg" className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 text-lg px-8 py-6 rounded-full font-semibold">
                            Start Chatting Now
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 hover:text-white text-lg px-8 py-6 rounded-full">
                            View Demo
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full px-4"
                >
                    {[
                        { icon: Zap, title: "Lightning Fast", desc: "Real-time message delivery with zero latency using WebSocket technology." },
                        { icon: Lock, title: "End-to-End Encrypted", desc: "Your conversations are private and secure. Only you and the recipient can read them." },
                        { icon: Users, title: "Community Focused", desc: "Create unlimited rooms and groups to stay connected with your favorite people." },
                    ].map((feature, index) => (
                        <div key={index} className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
