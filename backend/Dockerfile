# Use the latest LTS version of Node.js
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files explicitly
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
