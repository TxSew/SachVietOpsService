#!/bin/bash

# Reset your local branch to match the remote "main" branch
git reset --hard origin/main

# Pull the latest changes from the remote "main" branch
git pull origin main

# Check if the .env.prod file exists and copy it to .env for environment configuration
if [ -f .env.prod ]; then
    cp .env.prod .env
else
    echo ".env.prod not found, skipping copy"
fi

# Install project dependencies
npm install --no-optional

# Build the project, generating production-ready assets
npm run build

# Stop the existing PM2 process if it exists
pm2 delete thanh-api || true

# Start the application using the PM2 process manager with the name "thanh-api"
pm2 start dist/main.js --name thanh-api

# Reload the "thanh-api" application with updated environment variables
pm2 reload thanh-api --update-env

exit 0
