# Use the official Node.js image as the base image

FROM node:18-alpine

# Set the working directory inside the container

WORKDIR /boffinbutler

# Copy package.json and package-lock.json to the working directory

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy the rest of the application code

COPY . .

# Build the Next.js application

RUN npm run build

# Expose the port the app will run on

EXPOSE 3000

# Start the Next.js application in production mode

CMD ["npm", "start"]