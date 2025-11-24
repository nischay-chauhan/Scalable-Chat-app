import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function Navbar() {
    return (
        <nav className="relative z-50 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto border-b border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    ChatApp
                </span>
            </div>
            <div className="flex gap-4">
                <Link to="/login">
                    <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
                        Sign In
                    </Button>
                </Link>
                <Link to="/register">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/20">
                        Get Started
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
