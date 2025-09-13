# Use Node 18 image
FROM node:18

WORKDIR /app

# Copy package files first (so npm install works)
COPY package*.json ./

# Install all dependencies (dotenv included)
RUN npm install

# Copy the rest of the backend code
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]


