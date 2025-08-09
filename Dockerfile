# Dùng Node.js image chính thức
FROM node:20-bullseye

# Cài các thư viện cần thiết cho Chromium chạy ổn định
RUN apt-get update && apt-get install -y \
  wget ca-certificates fonts-liberation libnss3 lsb-release \
  libx11-6 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxrandr2 libxss1 libxrender1 libxkbcommon0 libasound2 \
  libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libgtk-3-0 \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Tạo thư mục app và set làm working directory
WORKDIR /usr/src/app

# Copy package.json và cài dependencies (bao gồm puppeteer và Chromium)
COPY package.json ./
RUN npm install

# Copy phần còn lại của code vào container
COPY . .

# Expose cổng 3000 (theo code server.js)
EXPOSE 3000

# Lệnh chạy app
CMD ["npm", "start"]
