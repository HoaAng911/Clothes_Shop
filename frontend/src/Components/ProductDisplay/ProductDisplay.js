import React, { useState, useEffect, useContext, useMemo } from 'react';
import './ProductDisplay.css';
import { useNavigate } from 'react-router-dom';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Contexts/ShopContext';
import axios from 'axios';
import useUploadStore from '../../store/useUploadStore';  // Import store upload

const ProductDisplay = (props) => {
  const { productId } = props;
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);

  // Lấy trạng thái và hàm uploadImage từ store Zustand
  const { imageUrl, loading, error, uploadImage } = useUploadStore();

  const fullImageUrl = useMemo(() => {
    // Nếu vừa upload thành công thì ưu tiên hiển thị ảnh mới upload
    if (imageUrl) return imageUrl;
    return `http://localhost:5000/uploads/${product?.image}`;
  }, [product?.image, imageUrl]);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/product/${productId}`);
        if (response.data) setProduct(response.data);
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
    if (!product || !product._id) {
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file ảnh trước khi tải lên');
      return;
    }
    uploadImage(selectedFile);
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

        {/* Thêm phần upload ảnh */}
        <div style={{ marginTop: '20px' }}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUploadClick} disabled={loading} style={{ marginLeft: '10px' }}>
            {loading ? 'Đang tải lên...' : 'Tải ảnh lên'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {imageUrl && <p style={{ color: 'green' }}>Tải ảnh lên thành công!</p>}
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
