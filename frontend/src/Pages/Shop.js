import React, { useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import Item from '../Components/Item/Item';
import DescribeUs from '../Components/DescribeUs/DescribeUs';
import './Shop.css';

const Shop = () => {
    const {
        popularProducts,
        newCollection,
        fetchPopularProducts,
        fetchNewCollection,
        loading: loadingPopular,
        loadingNewCollection,
        error: errorPopular,
        errorNewCollection
    } = useProductStore();

    useEffect(() => {
        fetchPopularProducts();
        fetchNewCollection();
    }, [fetchPopularProducts, fetchNewCollection]);

    // Log các thông tin để kiểm tra giá trị
    useEffect(() => {
        console.log("Popular Products: ", popularProducts);
        console.log("New Collection: ", newCollection);
        console.log("Loading Popular: ", loadingPopular);
        console.log("Loading New Collection: ", loadingNewCollection);
        console.log("Error Popular: ", errorPopular);
        console.log("Error New Collection: ", errorNewCollection);
    }, [popularProducts, newCollection, loadingPopular, loadingNewCollection, errorPopular, errorNewCollection]);

    return (
        <div className="shop-page">
            {/* === PHỔ BIẾN CHO NỮ === */}
            <section style={{ marginBottom: '3rem' }}>
                <h2>PHỔ BIẾN CHO NỮ</h2>
                <hr />
                {loadingPopular && <p>Đang tải sản phẩm phổ biến...</p>}
                {errorPopular && <p style={{ color: 'red' }}>{errorPopular}</p>}
                <div className="grid-container">
                    {popularProducts.map(product => (
                        <Item
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            image={product.image}
                            new_price={product.new_price}
                            old_price={product.old_price}
                        />
                    ))}
                </div>
            </section>

            {/* === BỘ SƯU TẬP MỚI === */}
            <section style={{ marginBottom: '3rem' }}>
                <h2>BỘ SƯU TẬP MỚI</h2>
                <hr />
                {loadingNewCollection && <p>Đang tải bộ sưu tập mới...</p>}
                {errorNewCollection && <p style={{ color: 'red' }}>{errorNewCollection}</p>}
                <div className="grid-container">
                    {newCollection.length > 0 ? (
                        newCollection.slice(0, 8).map(product => (  /* Lọc 8 sản phẩm đầu tiên */
                            <Item
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                image={product.image}
                                new_price={product.new_price}
                                old_price={product.old_price}
                            />
                        ))
                    ) : (
                        <p>Không có sản phẩm mới nào.</p>
                    )}
                </div>
            </section>

            {/* === Giới thiệu về chúng tôi === */}
            <DescribeUs />
        </div>
    );
};

export default Shop;
