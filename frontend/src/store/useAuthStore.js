import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isCheckingAuth: true,
    isUpdating: false,

    // Đăng ký
    signup: async (credentials) => {
        set({ isSigningUp: true });
        try {
            const res = await axios.post("http://localhost:5000/api/v1/auth/signup", credentials);
            set({ user: res.data.user });
            toast.success("Đăng ký thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đăng ký");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Đăng nhập
    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const res = await axios.post("http://localhost:5000/api/v1/auth/login", credentials);
            console.log("Login response:", res.data);

            // Kiểm tra và lưu token vào localStorage
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                console.log("Token lưu trong localStorage:", res.data.token);
            }

            // Lưu thông tin người dùng vào store
            set({ user: res.data.user });
            toast.success("Đăng nhập thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đăng nhập");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // Đăng xuất
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axios.post("http://localhost:5000/api/v1/auth/logout");
            localStorage.removeItem("token"); // Xóa token khỏi localStorage khi đăng xuất
            set({ user: null });
            toast.success("Đăng xuất thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đăng xuất");
        } finally {
            set({ isLoggingOut: false });
        }
    },

    // Kiểm tra xác thực
    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                set({ user: null });
                throw new Error("Không có token");
            }

            // Gửi yêu cầu API với token trong header
            const res = await axios.get("http://localhost:5000/api/v1/auth/check-auth", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Nếu token hợp lệ, lưu thông tin người dùng vào store
            set({ user: res.data.user });
        } catch (err) {
            console.error("Lỗi khi kiểm tra xác thực:", err.message);

            // Nếu token hết hạn hoặc không hợp lệ, xóa token và yêu cầu đăng nhập lại
            set({ user: null });
            localStorage.removeItem("token"); // Xóa token khỏi localStorage
            toast.error("Token hết hạn, vui lòng đăng nhập lại.");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Cập nhật thông tin người dùng
    updateUser: async (updates) => {
        set({ isUpdating: true });
        try {
            const token = localStorage.getItem("token");

            // Kiểm tra token có tồn tại không
            if (!token) {
                toast.error("Vui lòng đăng nhập lại");
                return;
            }

            const res = await axios.put("http://localhost:5000/api/v1/auth/update", updates, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({ user: res.data.user });
            toast.success("Cập nhật thông tin thành công");
        } catch (err) {
            // Xử lý lỗi token hết hạn hoặc không hợp lệ
            if (err.response?.status === 401) {
                toast.error("Token hết hạn, vui lòng đăng nhập lại.");
                localStorage.removeItem("token");  // Xóa token khỏi localStorage
                set({ user: null });  // Đăng xuất người dùng
            } else {
                toast.error(err.response?.data?.message || "Lỗi cập nhật");
            }
        } finally {
            set({ isUpdating: false });
        }
    },

}));
