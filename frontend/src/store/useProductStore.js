import { create } from 'zustand';
import axiosInstance from './axiosInstance'; // Đường dẫn tùy vào cấu trúc thư mục

const useProductStore = create((set) => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    popularProducts: [],
    newCollection: [],
    loadingNewCollection: false,
    errorNewCollection: null,

    fetchAllProducts: async () => {
        const { products, loading } = useProductStore.getState();
        if (products.length > 0 || loading) return;

        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/product');
            const productsData = Array.isArray(res.data) ? res.data : res.data.products || [];
            if (!productsData.length) {
                set({ products: [], loading: false, error: 'Không có sản phẩm nào từ API' });
                return;
            }
            set({ products: productsData, loading: false });
        } catch (err) {
            console.error('Lỗi khi tải sản phẩm:', err);
            set({ error: `Lỗi khi tải sản phẩm: ${err.message}`, loading: false });
        }
    },

    fetchPopularProducts: async () => {
        const { loading } = useProductStore.getState();
        if (loading) return;

        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/product/popular');
            set({ popularProducts: res.data, loading: false });
        } catch (err) {
            console.error('Lỗi khi tải sản phẩm phổ biến:', err);
            set({ error: 'Lỗi khi tải sản phẩm phổ biến', loading: false });
        }
    },

    fetchNewCollection: async () => {
        const { loadingNewCollection } = useProductStore.getState();
        if (loadingNewCollection) return;

        set({ loadingNewCollection: true, errorNewCollection: null });
        try {
            const res = await axiosInstance.get('/product/collection/new');
            set({ newCollection: res.data, loadingNewCollection: false });
        } catch (err) {
            console.error('Lỗi khi tải bộ sưu tập mới:', err);
            set({ errorNewCollection: err.message, loadingNewCollection: false });
        }
    },

    fetchProductsByCategory: async (category) => {
        const { loading } = useProductStore.getState();
        if (loading) return;

        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/product/collection/${category}`);
            set({ products: res.data, loading: false });
        } catch (err) {
            console.error('Lỗi khi tải sản phẩm theo danh mục:', err);
            set({ error: 'Lỗi khi tải sản phẩm theo danh mục', loading: false });
        }
    },

    fetchProductById: async (id) => {
        const { product, loading } = useProductStore.getState();
        if (loading) return;
        if (product && product.id === id) return;

        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/product/${id}`);
            if (res.data && res.data.id) {
                set({ product: res.data, loading: false });
            } else {
                set({ error: 'Dữ liệu sản phẩm không hợp lệ', loading: false });
            }
        } catch (err) {
            console.error('Lỗi khi tải sản phẩm:', err);
            set({ error: 'Lỗi khi tải sản phẩm', loading: false });
        }
    },
}));

export default useProductStore;
