const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    updateUser,
} = require("../controllers/auth.controller.js");
const { protectRoute } = require("../middleware/protectRoute.js");

const router = express.Router();

// Đăng ký tài khoản mới
router.post("/signup", async (req, res) => {
    try {
        await registerUser(req, res);
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi khi đăng ký tài khoản." });
    }
});

// Đăng nhập
router.post("/login", async (req, res) => {
    try {
        await loginUser(req, res);
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi khi đăng nhập." });
    }
});

// Đăng xuất
router.post("/logout", async (req, res) => {
    try {
        await logoutUser(req, res);
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi khi đăng xuất." });
    }
});

// Kiểm tra người dùng đã xác thực chưa (dùng khi load lại trang, kiểm tra user)
router.get("/check-auth", protectRoute, checkAuth);

// Cập nhật thông tin người dùng
router.put("/update", protectRoute, async (req, res) => {
    try {
        await updateUser(req, res);
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật thông tin." });
    }
});

module.exports = router;
