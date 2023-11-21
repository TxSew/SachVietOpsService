#!/bin/bash
dos2unix start.sh
# Ensure the script is executed with root privileges
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" >&2
   exit 1
fi

# Optionally change directory to your project's location
# cd /path/to/your/project || exit

# Install NestJS CLI globally if it is not already installed
if ! command -v nest > /dev/null 2>&1; then
    npm install -g @nestjs/cli
fi

# Install PM2 globally if it is not already installed
if ! command -v pm2 > /dev/null 2>&1; then
    npm install -g pm2
fi

# Navigate to the project directory before resetting git branch
# Update this to your project directory
#cd /var/www/thanh || exit

# Reset your local branch to match the remote "main" branch
git reset --hard origin/main

# Pull the latest changes from the remote "main" branch
git pull origin main

# Check if the .env.prod file exists and copy it to .env for environment configuration
cp .env.prod .env

# Install project dependencies
npm install

# Build the project, generating production-ready assets
npm run build

# Start the application using the PM2 process manager with the name "thanh-api"
pm2 start dist/main.js --name thanh-api

# Reload the "thanh-api" application with updated environment variables
pm2 reload thanh-api --update-env
exit 0
