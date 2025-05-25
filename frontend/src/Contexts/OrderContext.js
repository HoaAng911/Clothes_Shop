import React, { createContext, useState } from 'react';
import axiosInstance from '../axiosInstance'; // đảm bảo đúng đường dẫn

// Tạo context
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const createOrder = async (orderData) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post('/orders', orderData); // dùng axiosInstance

            if (res.status === 201 || res.status === 200) {
                setOrders(prev => [...prev, res.data]);
                return { success: true, data: res.data };
            } else {
                return { success: false, message: res.data.message || 'Đơn hàng không hợp lệ' };
            }
        } catch (err) {
            console.error('Lỗi gửi đơn hàng:', err);
            return { success: false, message: err.response?.data?.message || 'Có lỗi khi gửi đơn hàng' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, createOrder, loading }}>
            {children}
        </OrderContext.Provider>
    );
};
