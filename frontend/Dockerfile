# Giai đoạn build
FROM node:18 AS build

# Tạo thư mục làm việc
WORKDIR /app

# Copy các file cấu hình
COPY package.json package-lock.json* ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ project vào container
COPY . .

# Build production version
RUN npm run build

# Giai đoạn chạy: dùng nginx để phục vụ React
FROM nginx:alpine

# Copy file build vào thư mục mặc định của nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Lệnh chạy nginx
CMD ["nginx", "-g", "daemon off;"]
