# Stage 1: Build Angular
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Angular for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular build output to Nginx html folder
COPY --from=build /app/dist/daftar-moein-v0/browser /usr/share/nginx/html

# Expose port 9182
EXPOSE 9182

CMD ["nginx", "-g", "daemon off;"]
