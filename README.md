# SMS Manager

## How to start
git clone https://github.com/shovikghosh/phone.git
cd phone
npm install
sudo npm i -g pm2   (to manage node.js process)
export NODE_ENV=production (to set environment values)
pm2 start server.js --name sms

## DB Connections
Redis and Postgres is assumed to be hosted on localhost,on default ports
To change the settings, change values in phone/config/production.js

## Test
To run tests, go inside phone folder, and run
npm test

## Logs
Logs are present in ~/.pm2/logs/sms-out-0.log
