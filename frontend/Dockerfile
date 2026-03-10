FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration as a template
COPY nginx.conf /etc/nginx/conf.d/config.template

# Expose port (documented, but Railway uses $PORT)
EXPOSE 80

# Use a shell command to substitute $PORT into the config and start nginx
CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/config.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
