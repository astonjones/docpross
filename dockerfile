# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Set environment variables for Node.js application
ENV NODE_ENV production
ENV PORT 3000

# Set environment variables for MongoDB
ENV MONGO_DB docpross
ENV MONGO_URI mongodb://localhost:27017/docpross

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install MongoDB in the container
RUN apt-get update && \
    apt-get install -y gnupg && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code to the container
COPY . .

# Expose ports 3000 and 27017
EXPOSE 3000 27017

# Start the MongoDB service
CMD ["mongod", "--bind_ip_all", "--fork", "--logpath", "/var/log/mongodb.log"] && npm start