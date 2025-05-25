
import { create } from 'zustand';
import axiosInstance from './axiosInstance'; // Đường dẫn phù hợp với dự án của bạn

const useOrderStore = create((set) => ({
    order: null,
    loading: false,
    error: null,
    success: false,

    createOrder: async (orderData) => {
        set({ loading: true, error: null, success: false });

        try {
            const res = await axiosInstance.post('/order', orderData);
            set({ order: res.data, loading: false, success: true });
        } catch (err) {
            console.error('Lỗi tạo đơn hàng:', err);
            set({
                error: err.response?.data?.message || 'Lỗi không xác định',
                loading: false,
                success: false
            });
        }
    },

    resetOrder: () => {
        set({ order: null, loading: false, error: null, success: false });
    }
}));

export default useOrderStore;
