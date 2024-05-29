FROM node:20 AS build

ARG VITE_BACKEND_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine

COPY nginx.conf ./
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
