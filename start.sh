#!/bin/bash
  
pm2 delete thanh-api || true
pm2 start dist/main.js --name thanh-api
pm2 save    