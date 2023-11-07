#!/bin/bash

# Change directory to your project's location
# cd /var/www/thanh (You can uncomment this line if needed)

# Install NestJS CLI globally
# npm install -g @nestjs/cli (You can uncomment this line if needed)

# Install PM2 globally
# npm install -g pm2 (You can uncomment this line if needed)

# Reset your local branch to match the remote "main" branch
git reset --hard origin/main

# Pull the latest changes from the remote "main" branch
git pull origin main

# Copy the .env.prod file to .env for environment configuration
cp .env.prod .env

# Install project dependencies
npm install

# Build the project, generating production-ready assets
npm run build

# Start the application using the PM2 process manager with the name "thanh-api"
pm2 start dist/main.js --name thanh-api

# Reload the "thanh-api" application with updated environment variables
pm2 reload thanh-api --update-env

# Exit the script with a success status code (0)
exit 0
