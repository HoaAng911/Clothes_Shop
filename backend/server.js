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


// Khởi tạo ứng dụng Express
const app = express();
const allowedOrigins = [
    'http://localhost:3000',                 // frontend dev local
    'https://clothes-shop-ggh5.onrender.com' // frontend deploy trên render
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép requests không có origin (ví dụ: Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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

app.get('/', (req, res) => {
    res.send('Hello Thầy Ý ! Đây là API của Ngọc Hoàng.');
});

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
