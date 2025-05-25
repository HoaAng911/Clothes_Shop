import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faShoppingCart,
  faHouse,
  faBaby,
  faPeopleGroup,
  faPersonDress,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../../Contexts/ShopContext";
import { useAuthStore } from "../../store/useAuthStore";
import "./Navbar.css";
import banner_main from "../Assets/banner5.png";
import banner_main_4 from "../Assets/banner4.png";
import logo from "../Assets/logo.jpg";

const Navbar = () => {
  const { all_product, getTotalCartAmount } = useContext(ShopContext);
  const { user, logout, authCheck } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(all_product);
  const [isFixed, setIsFixed] = useState(false);
  const topRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    authCheck(); // Kiểm tra xác thực khi component mount
  }, [authCheck]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const top = topRef.current;

      if (currentScrollY > 100) {
        top?.classList.add("hidden");
        setIsFixed(true);
      } else {
        top?.classList.remove("hidden");
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filtered = all_product.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      if (filtered.length > 0) {
        navigate("/search", { state: { results: filtered } });
      } else {
        alert("Không tìm thấy sản phẩm phù hợp.");
      }
    }
  };

  return (
    <div className="navbar-wrapper">
      <header className="navbar-header">
        <div className="navbar-top" ref={topRef}>
          <div className="navbar-row">
            <div className="navbar-left">
              <div className="logo">
                <Link to="/shop">
                  <img
                    alt="Logo"
                    src="https://pos.nvncdn.com/69e708-173581/store/20240425_lHnv9RXr.png"
                  />
                </Link>
              </div>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm sản phẩm bạn muốn mua"
                />
                <button type="submit">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </form>
            </div>

            <div className="navbar-right">
              {user ? (
                <div className="user-avatar-container">
                  <img src={logo} alt="User" className="user-avatar" />
                  <div className="dropdown-menu">
                    <Link to="/profile">Thông tin cá nhân</Link>
                    <Link to="/cart">Đơn hàng</Link>
                    <button onClick={logout}>Đăng xuất</button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login">Đăng nhập</Link>
                  <span>|</span>
                  <Link to="/register">Đăng ký</Link>
                </div>
              )}

              <Link to="/cart" className="cart-icon">
                <FontAwesomeIcon icon={faShoppingCart} />
              </Link>
            </div>
          </div>
        </div>

        <nav className={`navbar-menu ${isFixed ? "fixed" : ""}`}>
          <ul>
            <li>
              <Link to="/shop">
                <FontAwesomeIcon icon={faHouse} /> HOME
              </Link>
            </li>
            <li>
              <Link to="/man">
                <FontAwesomeIcon icon={faPerson} /> MAN
              </Link>
            </li>
            <li>
              <Link to="/woman">
                <FontAwesomeIcon icon={faPersonDress} /> WOMEN
              </Link>
            </li>
            <li>
              <Link to="/kid">
                <FontAwesomeIcon icon={faBaby} /> KIDS
              </Link>
            </li>
            <li>
              <Link to="/aboutus">
                <FontAwesomeIcon icon={faPeopleGroup} /> ABOUT US
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="banner-slider">
        <img src={banner_main} alt="Banner 1" />
        <img src={banner_main_4} alt="Banner 2" />
      </div>
    </div>
  );
};

export default Navbar;
