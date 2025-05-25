import axiosInstance from "./axiosInstance";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isCheckingAuth: true,
    isUpdating: false,

    signup: async (credentials) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", credentials);
            set({ user: res.data.user });
            toast.success("Đăng ký thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đăng ký");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", credentials);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            set({ user: res.data.user });
            toast.success("Đăng nhập thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đăng nhập");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("token");
            set({ user: null });
            toast.success("Đăng xuất thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đăng xuất");
        } finally {
            set({ isLoggingOut: false });
        }
    },

    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ user: res.data.user });
        } catch (err) {
            console.error("Lỗi khi kiểm tra xác thực:", err.message);
            set({ user: null });
            localStorage.removeItem("token");
            toast.error("Token hết hạn, vui lòng đăng nhập lại.");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    updateUser: async (updates) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put("/auth/update", updates);
            set({ user: res.data.user });
            toast.success("Cập nhật thông tin thành công");
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error("Token hết hạn, vui lòng đăng nhập lại.");
                localStorage.removeItem("token");
                set({ user: null });
            } else {
                toast.error(err.response?.data?.message || "Lỗi cập nhật");
            }
        } finally {
            set({ isUpdating: false });
        }
    },
}));
