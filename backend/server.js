const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { ENV_VARS } = require('./config/envVars');  // Lấy các biến môi trường từ config
const { ConnectDB } = require('./config/db');    // Kết nối đến DB
const cors = require('cors');
const authRoutes = require('./routes/auth.route');
const productRoute = require('./routes/product.route');
const uploadRoutes = require('./routes/upload.route');
const orderRoutes = require('./routes/order.route');
const cartRoutes = require('./routes/cart.route'); // Đường dẫn cho giỏ hàng
console.log('authRoutes typeof:', typeof authRoutes);
console.log('productRoute typeof:', typeof productRoute);
console.log('uploadRoutes typeof:', typeof uploadRoutes);
console.log('orderRoutes typeof:', typeof orderRoutes);
console.log('cartRoutes typeof:', typeof cartRoutes);
function checkRouter(name, router) {
    if (typeof router !== 'function') {
        console.error(`[ERROR] ${name} không phải là function!`);
    } else {
        console.log(`[OK] ${name} là function.`);
    }
}
// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình CORS: Cho phép frontend từ localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',  // Cấu hình CORS chỉ cho phép frontend này
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Các phương thức cho phép
    credentials: true,  // Hỗ trợ cookies (nếu cần cho đăng nhập)
}));

// Middleware cơ bản
app.use(express.json());  // Để xử lý JSON trong body request
app.use(cookieParser());  // Để xử lý cookies
// Xử lý static files (ảnh tải lên) từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log đơn giản: Mỗi lần request đến server sẽ log thông tin
// app.use((req, res, next) => {
//     console.log(`Request: [${req.method}] ${req.originalUrl} from ${req.get('host')} at ${new Date().toLocaleString()}`);
//     console.log('Headers:', req.headers);
//     next();
// });

console.log('authRoutes:', authRoutes);
console.log('productRoute:', productRoute);
console.log('uploadRoutes:', uploadRoutes);
console.log('orderRoutes:', orderRoutes);
console.log('cartRoutes:', cartRoutes);

app.use("/api/v1/auth", authRoutes);   // Auth routes (Đăng ký, đăng nhập...)
app.use("/api/v1/product", productRoute);  // Product routes (Quản lý sản phẩm)
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/cart', cartRoutes); // Đường dẫn cho giỏ hàng
app.use('/api/v1/orders', orderRoutes);
// Bạn có thể thêm các routes khác ở đây sau này, ví dụ:
// app.use("/api/v1/products", productRoutes); 
// app.use("/api/v1/orders", orderRoutes);  // Nếu có routes cho orders



// Khởi động server
app.listen(ENV_VARS.PORT, async () => {
    try {
        // Kết nối DB trước khi khởi động server
        await ConnectDB();
        console.log(`✅ Server chạy tại http://localhost:${ENV_VARS.PORT}`);
    } catch (err) {
        console.error("❌ Không kết nối được DB:", err.message);
    }
});
