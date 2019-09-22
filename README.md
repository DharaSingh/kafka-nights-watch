# kafka-nights-watch

This is my first react and nodeJs project, trying to build a monitoring tool for kafka clusters.

A service to monitor kafka cluster, lagging in consumer groups, list of topic, latest msgs in each topic etc.

Requirements: 
1. Install Node : Follow NodeJs official page https://nodejs.org/en/download/
2. Install Mongodb : for mac brew install mongodb-community or  https://treehouse.github.io/installation-guides/mac/mongo-mac.html

Service setup :
1. npm install 
2. cd client & npm install
3. cd server & npm install

#Service start :
1. npm start : this command will start client and serve, client and port 3000 and server at 8080 defined in .env.dev. Change port in package.json in client and .dev.env file if you want to start server at some different port

Coming Soon...
1. Login with mongodb seessions
2. Kafka monitoring 

