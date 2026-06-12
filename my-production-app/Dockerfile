# Use an official lightweight Node runtime environment
FROM node:18-alpine

# Set the operational directory inside the virtual container
WORKDIR /usr/src/app

# Copy dependency definition maps first for optimal build caching
COPY package*.json ./

# Install only production dependencies (skips local tools like Jest)
RUN npm install --only=production

# Copy the rest of your local codebase into the container
COPY . .

# Expose the network port your server runs on
EXPOSE 5000

# Fire up the engine
CMD ["node", "src/app.js"]