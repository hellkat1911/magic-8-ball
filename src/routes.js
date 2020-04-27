const url = require('url');
const controller = require('./controller');

/*
  middleware to handle routing --
  parse uris and run the correct controller modules
*/

module.exports = (request, response) => {
  const path = url.parse(request.url, true).pathname;
  
  // handle GET requests
  if (request.method === 'GET') {

    switch (path) {
    // redirect to app location from root
    case '/':
      response.writeHead(302 , {
        'Location': '/magic-eight-ball'
      });
      response.end();
      break;

    case '/magic-eight-ball':
      controller.getHomepage(request, response);
      break;

    case '/favicon.ico':
      controller.getFavicon(request, response);
      break;

    case '/styles/normalize.css':
      controller.getNormalize(request, response);
      break;

    case '/styles/styles.css':
      controller.getStyles(request, response);
      break;

    case '/js/scripts.js':
      controller.getScripts(request, response);
      break;

    case '/assets/magic-8-ball.png':
      controller.getImage(request, response);
      break;

    case '/api/history':
      controller.getHistory(request, response);
      break;

    default:
      // send 404 for other paths
      controller.get404(request, response);
    }

  // handle POST requests
  } else if (request.method === 'POST') {

    switch (path) {
    case '/api/history':
      controller.postHistory(request, response);
      break;

    default:
      // send 404 for other paths
      controller.get404(request, response);
    }

  // handle DELETE requests
  } else if (request.method === 'DELETE') {

    switch (path) {
    case '/api/history':
      controller.deleteHistory(request, response);
      break;

    default:
      // send 404 for other paths
      controller.get404(request, response);
    }

  } else {
    // send 404 for other methods
    controller.get404(request, response);
  }
};