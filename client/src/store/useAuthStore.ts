import { create } from "zustand";
import api from "@/lib/api";

interface User {
    id: string;
    username: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (formData: any) => Promise<boolean>;
    register: (formData: any) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem("currentUser") || "null"),
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,

    login: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post("/api/auth/login", formData);

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                set({ user: data.user, token: data.token, isLoading: false });
                return true;
            } else {
                set({ error: data.error || "Login failed", isLoading: false });
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to connect to server";
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post("/api/auth/register", formData);

            if (data.success) {
                set({ isLoading: false });
                return true;
            } else {
                set({ error: data.error || "Registration failed", isLoading: false });
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to connect to server";
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        set({ user: null, token: null });
    },
}));
