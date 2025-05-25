import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';

const Product = () => {
    const { productId } = useParams(); // Lấy productId từ URL
    const [validProductId, setValidProductId] = useState(null);

    useEffect(() => {
        if (productId) {
            console.log('Product useEffect, productId:', productId);
            setValidProductId(productId); // Gán vào state để chắc chắn không bị undefined
        }
    }, [productId]);

    if (!validProductId) {
        return <div>Đang tải sản phẩm...</div>; // Tránh render khi chưa có productId
    }

    return (
        <div>
            <ProductDisplay productId={validProductId} />
        </div>
    );
};

export default Product;
