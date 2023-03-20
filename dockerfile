# Base image for your application
FROM node:14-alpine as base

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Second stage: a new container for MongoDB
FROM mongo:4.4.8

# Set the working directory
WORKDIR /mongo-data

# Copy the MongoDB configuration file
COPY mongod.conf /etc/mongod.conf

# Expose MongoDB ports
EXPOSE 27017

# Set the entry point for the MongoDB container
CMD ["mongod", "-f", "/etc/mongod.conf"]

# Third stage: another new container for your application
FROM base

# Expose the port that the application will listen on
EXPOSE 3000

# Set environment variables for the application
ENV PORT 3000

# Set the entry point for the application container
CMD ["npm", "start"]