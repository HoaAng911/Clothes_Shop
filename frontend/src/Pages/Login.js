import React, { useState } from "react";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js"; // Nhập store zustand
import loginImage from "../Components/Assets/Pasted-20250410-122037_preview_rev_1.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, user } = useAuthStore(); // Lấy phương thức login và trạng thái isLoggingIn từ store
  const navigate = useNavigate(); // Để chuyển hướng khi đăng nhập thành công

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Vui lòng nhập mật khẩu"),
  });

  const handleSubmit = async (values) => {
    await login(values);  // Gọi phương thức login từ store zustand

    // Lưu thông tin người dùng vào localStorage
    const loggedInUser = {
      email: values.email,
      // Thêm các thông tin khác nếu cần
    };
    localStorage.setItem("user", JSON.stringify(loggedInUser)); // Lưu vào localStorage

    navigate("/shop"); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginImage} alt="" />
      </div>
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <p>Mở khóa thế giới của bạn.</p>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <label>Email</label>
            <Field name="email" type="email" placeholder="Nhập email của bạn" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Mật khẩu</label>
            <div className="password-field">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ErrorMessage name="password" component="div" className="error" />

            <button type="submit" className="btn-primary" disabled={isLoggingIn}>
              {isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <button type="button" className="btn-outline">
              <Link to="/register" className="create-account-link">Tạo tài khoản</Link>
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
