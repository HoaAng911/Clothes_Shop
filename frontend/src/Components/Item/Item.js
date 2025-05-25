import React, { useState } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
    const [imageError, setImageError] = useState(false); // Trạng thái theo dõi lỗi hình ảnh
    const fullImageUrl = `http://localhost:5000/uploads/${props.image}`; // Ghép URL ảnh

    // Hàm xử lý khi hình ảnh gặp lỗi


    return (
        <div className='container'>
            <div className='item'>
                <Link to={`/product/${props.id}`}>
                    <img
                        onClick={() => window.scrollTo(0, 0)}
                        src={imageError ? '/path/to/default-image.png' : fullImageUrl}  // Dùng hình ảnh mặc định nếu gặp lỗi
                        alt={props.name}

                    />
                </Link>
                <p>{props.name}</p>
                <div className='item-prices'>
                    <div className="item-price-new">
                        ${props.new_price}
                    </div>
                    <div className="item-price-old">
                        ${props.old_price}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Item;
