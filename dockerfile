
FROM node:20.11.0-alpine

# Switch back to node user for security
USER node

# Create and set the working directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json first to leverage caching
COPY --chown=node:node package*.json ./

# Install dependencies efficiently
RUN npm install --no-audit --no-fund --prefer-offline --silent

# Copy the rest of the application files
COPY --chown=node:node . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
