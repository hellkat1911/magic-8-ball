const fs = require('fs');

const publicPath = `${__dirname}/../public`;

const htmlStringRes = (status, msg) => {
  return `<!doctype html><html><head><title>${status}</title></head><body>${status}: ${msg}</body></html>`;
};

// GET

exports.getHomepage = (request, response) => {
  response.writeHead(200, { 'Content-Type':'text/html' });
  fs.readFile(`${publicPath}/index.html`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    return response.end(data, 'utf-8');
  });
};

exports.getFavicon = (request, response) => {
  response.writeHead(200, { 'Content-Type':'image/x-icon' });
  fs.readFile(`${publicPath}/favicon.ico`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.end(data, 'utf-8');
  });
};

exports.getNormalize = (request, response) => {
  response.writeHead(200, { 'Content-Type':'text/css' });
  fs.readFile(`${publicPath}/styles/normalize.css`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.end(data, 'utf-8');
  });
};

exports.getStyles = (request, response) => {
  response.writeHead(200, { 'Content-Type':'text/css' });
  fs.readFile(`${publicPath}/styles/styles.css`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.end(data, 'utf-8');
  });
};

exports.getScripts = (request, response) => {
  response.writeHead(200, { 'Content-Type':'text/javascript' });
  fs.readFile(`${publicPath}/js/scripts.js`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.end(data, 'utf-8');
  });
};

exports.getImage = (request, response) => {
  response.writeHead(200, { 'Content-Type':'image/png' });
  fs.readFile(`${publicPath}/assets/magic-8-ball.png`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.end(data, 'utf-8');
  });
};

exports.getHistory = (request, response) => {
  // return empty array if file doesn't exist
  if (!fs.existsSync(`${__dirname}/data/history.json`)) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify({ status: 200, data: [], error: null }));
  } 
  fs.readFile(`${__dirname}/data/history.json`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.writeHead(200, { 'Content-Type':'application/json' });
    return response.end(JSON.stringify({ status: 200, data: JSON.parse(data.toString()).data, error: null }));
    
  });
};

exports.get404 = (request, response) => {
  response.writeHead(404, 'Not Found', { 'Content-Type': 'text/html; charset=utf-8' });
  return response.end(htmlStringRes(404, 'Not Found'));
};

// POST

exports.postHistory = (request, response) => {
  let body = '';
  // read chunked data into body
  request.on('data', data => {
    body += data;
    if (body.length > 1e7) {
      response.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 413, data: null, error: 'Request Entity Too Large' }));
    }
  });
  request.on('end', () => {
    let json;

    // check for json format
    try {
      json = JSON.parse(body.toString());
    } catch (err) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 400, data: null, error: 'Bad Request' }));
    }
    
    // check for 'data' property that is an array
    if (!json.data || !Array.isArray(json.data)) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 400, data: null, error: 'Bad Request' }));
    }

    const buffer = Buffer.from(JSON.stringify({ data: json.data }));

    // write json to file (create file if it doesn't exist)
    fs.writeFile(`${__dirname}/data/history.json`, buffer, { flag: 'w' }, (err) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ status: 500, data: null, error: err }));
      }
      response.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 200, data: json.data, error: null }));
    });
  });
};

// DELETE

exports.deleteHistory = (request, response) => {
  var blank = { data: [] };
  response.writeHead(200, { 'Content-Type':'application/json' });
  fs.writeFile(`${__dirname}/data/history.json`, JSON.stringify(blank), { flag: 'w' }, (err) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ status: 500, data: null, error: err }));
    }
    response.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify({ status: 200, data: blank.data, error: null }));
  });
};