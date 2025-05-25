import React, { useState, useEffect, useContext, useMemo } from 'react';
import './ProductDisplay.css';
import { useNavigate } from 'react-router-dom';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Contexts/ShopContext';
import axios from 'axios';

const ProductDisplay = (props) => {
  const { productId } = props;  // Giả sử bạn truyền productId qua props
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);

  const fullImageUrl = useMemo(() => `http://localhost:5000/uploads/${product?.image}`, [product?.image]);
  useEffect(() => {
    if (!productId) return; // Tránh log lỗi khi đang chờ productId
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/product/${productId}`);
        console.log('Dữ liệu sản phẩm:', response.data); // Kiểm tra dữ liệu trả về
        if (response.data) {
          setProduct(response.data);
        } else {
          console.error('Không có dữ liệu sản phẩm');
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Đang tải thông tin sản phẩm...</div>;
  }

  const showDropdownNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const handleSizeToggle = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showDropdownNotification('Vui lòng chọn kích thước trước khi thêm vào giỏ hàng.');
      return;
    }
    if (!product || !product.id) {
      console.error('Product data is missing or invalid');
      return;
    }
    addToCart(product._id, selectedSize);
    showDropdownNotification(`Đã thêm ${product.name} (Kích thước: ${selectedSize}) vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showDropdownNotification('Vui lòng chọn kích thước trước khi mua.');
      return;
    }
    addToCart(product._id, selectedSize);
    navigate('/payment');
  };

  return (
    <div className="productdisplay">
      {showNotification && (
        <div id="notification">{notificationMessage}</div>
      )}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              src={fullImageUrl}
              alt="Ảnh sản phẩm"
              onClick={() => window.scrollTo(0, 0)}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={fullImageUrl}
            alt="Ảnh sản phẩm chính"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="Đánh giá" />
          ))}
          <img src={star_dull_icon} alt="Đánh giá" />
          <p>(122 đánh giá)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          {product.description || 'Mô tả sản phẩm chưa có sẵn.'}
        </div>
        <div className="productdisplay-right-size">
          <h1>Chọn kích thước</h1>
          <div className="productdisplay-right-sizes">
            {product.size && product.size.map((size) => (
              <div
                key={size}
                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <button onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG</button>
          <button className="buy-now-button" onClick={handleBuyNow}>
            MUA NGAY
          </button>
        </div>
        <p className="productdisplay-right-category">
          <span>Danh mục: </span>{product.category || 'Chưa rõ'}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags: </span>Hiện đại, Mới nhất
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
