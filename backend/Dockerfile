# Base image
FROM node:18

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json và lock file (nếu có)
COPY package*.json ./

# Cài đặt dependency
RUN npm install

# Copy toàn bộ mã nguồn backend vào image
COPY . .

# Expose cổng (giả sử server chạy trên 5000)
EXPOSE 5000

# Lệnh khởi động
CMD ["npm", "start"]
