import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import loginImage from "../Components/Assets/IMG_Resgiter.png";
import "./Resgiter.css";

const Resgiter = () => {
  const [submitMessage, setSubmitMessage] = useState("");
  const { signup, isSigningUp } = useAuthStore();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập tên"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Vui lòng nhập mật khẩu"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await signup(values);
      setSubmitMessage("🎉 Đăng ký thành công!");
      resetForm();
    } catch (error) {
      setSubmitMessage("Đã có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="resgiter-container">
      <div className="resgiter-form">
        <h2>Đăng Ký</h2>
        <p>Mở khóa thế giới của bạn.</p>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <label>Họ và tên</label>
            <Field name="username" type="text" placeholder="Nhập tên của bạn" />
            <ErrorMessage name="username" component="div" className="error" />

            <label>Email</label>
            <Field name="email" type="email" placeholder="Nhập email của bạn" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Mật khẩu</label>
            <Field name="password" type="password" placeholder="Nhập mật khẩu" />
            <ErrorMessage name="password" component="div" className="error" />

            <label>Xác nhận mật khẩu</label>
            <Field name="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />

            <button type="submit" className="btn-primary" disabled={isSigningUp}>
              {isSigningUp ? "Đang đăng ký..." : "Tạo tài khoản"}
            </button>
            {submitMessage && <div className="success-message">{submitMessage}</div>}
            <p style={{ marginTop: "1rem" }}>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </Form>
        </Formik>
      </div>
      <div className="resgiter-image">
        <img src={loginImage} alt="register" />
      </div>
    </div>
  );
};

export default Resgiter;
