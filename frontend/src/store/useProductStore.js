import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    popularProducts: [],
    newCollection: [],

    fetchAllProducts: async () => {
        const { products, loading } = useProductStore.getState();
        if (products.length > 0 || loading) return;

        set({ loading: true, error: null });
        try {
            const res = await axios.get('http://localhost:5000/api/v1/product');
            console.log('API response:', res.status, res.data);
            let productsData = Array.isArray(res.data) ? res.data : res.data.products || [];
            if (!productsData.length) {
                console.warn('API trả về danh sách sản phẩm rỗng');
                set({ products: [], loading: false, error: 'Không có sản phẩm nào từ API' });
                return;
            }
            set({
                products: productsData,
                loading: false
            });
        } catch (err) {
            console.error('Lỗi khi gọi API:', err.response?.status, err.message);
            set({ error: `Lỗi khi tải sản phẩm: ${err.message}`, loading: false });
        }
    },

    fetchPopularProducts: async () => {
        const { loading } = useProductStore.getState();
        if (loading) return; // Không gọi lại nếu đang tải
        set({ loading: true, error: null });
        try {
            const res = await axios.get('http://localhost:5000/api/v1/product/popular');
            set({ popularProducts: res.data, loading: false });
        } catch (err) {
            console.error(err);
            set({ error: 'Lỗi khi tải sản phẩm phổ biến', loading: false });
        }
    },

    fetchNewCollection: async () => {
        const { loadingNewCollection } = useProductStore.getState();
        if (loadingNewCollection) return;
        set({ loadingNewCollection: true, errorNewCollection: null });
        try {
            const res = await axios.get('http://localhost:5000/api/v1/product/collection/new');
            set({ newCollection: res.data, loadingNewCollection: false });
        } catch (err) {
            set({ errorNewCollection: err.message, loadingNewCollection: false });
        }
    },
    
    fetchProductsByCategory: async (category) => {
        const { loading } = useProductStore.getState();
        if (loading) return; // Không gọi lại nếu đang tải
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/product/collection/${category}`);
            set({ products: res.data, loading: false });
        } catch (err) {
            console.error(err);
            set({ error: 'Lỗi khi tải sản phẩm theo danh mục', loading: false });
        }
    },

    fetchProductById: async (id) => {
        const { product, loading } = useProductStore.getState();
        if (loading) return; // Không gọi lại nếu đang tải
        if (product && product.id === id) {
            console.log('Product already in state:', product);
            return; // Không tải lại nếu sản phẩm đã có trong state
        }
        set({ loading: true, error: null });
        try {
            console.log(`Fetching product with id: ${id}`);
            const res = await axios.get(`http://localhost:5000/api/v1/product/${id}`);
            console.log('Product data received:', res.data);
            if (res.data && res.data.id) { // Kiểm tra dữ liệu có đúng định dạng không
                set({ product: res.data, loading: false });
            } else {
                set({ error: 'Dữ liệu sản phẩm không hợp lệ', loading: false });
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            set({ error: 'Lỗi khi tải sản phẩm', loading: false });
        }
    },
}));

export default useProductStore;
