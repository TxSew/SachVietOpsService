#!bin/bash

cd /var/www/thanh
npm install -g @nestjs/cli
npm install -g pm2
git checkout -- .
git pull orgin main
# cp  .env.dev .env
npm install
npm run build
pm2 start dist/main.js --name thanh-api
pm2 reload thanh-api
exit 0