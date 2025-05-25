const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model.js');

// Middleware bảo vệ route
const protectRoute = async (req, res, next) => {
    try {
        // Lấy token từ cookie hoặc header Authorization
        let token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1];

        // Nếu không có token thì chặn lại
        if (!token) {
            return res.status(401).json({ success: false, message: "Không được phép. Vui lòng đăng nhập!" });
        }

        // Giải mã token và kiểm tra nếu token hết hạn
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
            }

            // Tìm người dùng dựa vào id đã mã hóa trong token
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ success: false, message: "Không tìm thấy người dùng" });
            }

            // Gắn thông tin user vào request để các controller khác dùng
            req.user = user;
            next(); // Tiếp tục xử lý request
        });
    } catch (err) {
        console.error("Lỗi trong middleware protectRoute:", err.message);
        return res.status(500).json({ success: false, message: "Lỗi trong quá trình xác thực token" });
    }
};

module.exports = { protectRoute };
