import React, { useEffect } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import useProductStore from '../../store/useProductStore';

const NewCollections = () => {
    const { newCollection, fetchNewCollection, loading, error } = useProductStore();

    useEffect(() => {
        console.log("Fetching new collection...");
        fetchNewCollection(); // Gọi API để lấy bộ sưu tập mới
    }, [fetchNewCollection]);

    // Log các giá trị để kiểm tra
    useEffect(() => {
        console.log("New Collection Data:", newCollection);
        console.log("Loading State:", loading);
        console.log("Error State:", error);
    }, [newCollection, loading, error]);

    return (
        <div className='new-collections'>
            <h1>NEW COLLECTIONS</h1>
            <hr />

            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="collections">
                {newCollection.length > 0 ? (
                    newCollection.map((item) => (
                        <Item
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    ))
                ) : (
                    <p>Không có sản phẩm mới nào.</p>
                )}
            </div>
        </div>
    );
};

export default NewCollections;
