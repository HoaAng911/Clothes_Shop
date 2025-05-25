import { create } from 'zustand';

// Tạo store với Zustand
const useCartStore = create((set, get) => ({
    cartItems: (() => {
        try {
            const raw = localStorage.getItem('cartItems');
            if (!raw) return {};
            const saved = JSON.parse(raw);
            // Lọc key có 'undefined'
            const filtered = Object.fromEntries(
                Object.entries(saved).filter(([key]) => !key.includes('undefined'))
            );
            // Cập nhật localStorage nếu có thay đổi
            if (Object.keys(filtered).length !== Object.keys(saved).length) {
                localStorage.setItem('cartItems', JSON.stringify(filtered));
            }
            console.log('Khởi tạo cartItems từ localStorage:', filtered);
            return filtered;
        } catch (err) {
            console.error('Lỗi khi parse cartItems từ localStorage:', err);
            return {};
        }
    })(),

    addToCart: (productId, size) => {
        console.log('Giỏ hàng trước khi thêm:', get().cartItems);
        console.log('Adding to cart - Product ID:', productId, 'Size:', size);

        // Kiểm tra đầu vào
        if (!productId || !size || typeof productId !== 'string' || typeof size !== 'string') {
            console.error('Invalid productId or size in addToCart:', { productId, size });
            return;
        }

        const key = `${productId}_${size}`;
        if (key.includes('undefined')) {
            console.error('Invalid key generated:', key);
            return;
        }

        try {
            set((state) => {
                const newCartItems = { ...state.cartItems };
                newCartItems[key] = (newCartItems[key] || 0) + 1;
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));
                console.log('Đã thêm vào giỏ hàng:', newCartItems);
                return { cartItems: newCartItems };
            });
        } catch (error) {
            console.error('Lỗi khi lưu vào localStorage:', error);
        }
    },

    removeFromCart: (productId, size) => {
        console.log('Removing from cart - Product ID:', productId, 'Size:', size);

        if (!productId || !size || typeof productId !== 'string' || typeof size !== 'string') {
            console.error('Invalid productId or size in removeFromCart:', { productId, size });
            return;
        }

        set((state) => {
            const newCartItems = { ...state.cartItems };
            const key = `${productId}_${size}`;

            if (key.includes('undefined')) {
                console.error('Invalid key generated:', key);
                return { cartItems: state.cartItems };
            }

            if (newCartItems[key] > 1) {
                newCartItems[key] -= 1;
            } else {
                delete newCartItems[key];
            }

            localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            console.log('Đã xóa khỏi giỏ hàng:', newCartItems);
            return { cartItems: newCartItems };
        });
    },

    getTotalCartAmount: (products) => {
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            return 0;
        }
        if (products.length === 0) {
            console.warn('Danh sách sản phẩm rỗng');
            return 0;
        }

        const { cartItems } = get();
        let total = 0;

        for (const [key, quantity] of Object.entries(cartItems)) {
            const [productId] = key.split('_');
            const product = products.find((p) => p._id === productId);
            if (product) {
                total += product.new_price * quantity;
            } else {
                console.warn(`Không tìm thấy sản phẩm với _id: ${productId}`);
            }
        }

        console.log('Tổng giá trị giỏ hàng:', total);
        return total;
    },

    syncCartWithProducts: (products) => {
        set((state) => {
            const newCartItems = { ...state.cartItems };
            let hasChanges = false;

            console.log('Đồng bộ giỏ hàng với products:', { cartItems: newCartItems, products });

            Object.keys(newCartItems).forEach((key) => {
                const [productId] = key.split('_');
                const productExists = products.some((p) => p._id === productId);
                if (!productExists) {
                    console.warn(`Xóa sản phẩm không hợp lệ khỏi giỏ hàng: ${productId}`);
                    delete newCartItems[key];
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                console.log('Cập nhật localStorage với giỏ hàng mới:', newCartItems);
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            }

            return { cartItems: newCartItems };
        });
    },

    clearCart: () => {
        set({ cartItems: {} });
        localStorage.removeItem('cartItems');
        console.log('Đã xóa toàn bộ giỏ hàng');
    },
}));

export default useCartStore;