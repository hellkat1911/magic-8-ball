// basic node apis
const http = require('http');
const routes = require('./src/routes.js');

// define the server with the routing middleware
const server = http.createServer((request, response) => {
  routes(request, response);
});

// spin up the server
server.listen(process.env.PORT, () => console.log(`Node server running at :${process.env.PORT}...`));

module.exports = server;