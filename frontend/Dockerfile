FROM node:18-alpine AS build

# This tells Docker to take the VITE_API_URL from Railway and build it into the React code
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

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
