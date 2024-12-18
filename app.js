const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;

// Function to serve HTML files
const serveHtml = (res, filePath) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('<h1>Error loading the page.</h1>');
      return;
    }
    res.end(data);
  });
};

const serveAssets = (req, res) => {
  const ext = path.extname(req.url); // Get file extension
  const contentType = getContentType(ext); // Get the correct content type
  const filePath = path.join(__dirname, req.url); // Get the full path to the static file
  
  serveStaticFile(res, filePath, contentType); // Serve the file
};


// Function to serve static files (CSS, images, etc.)
const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('<h1>File not found.</h1>');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
};

// Function to handle file extensions and serve the correct content type
const getContentType = (ext) => {
  switch (ext) {
    case '.css':
      return 'text/css';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.js':
      return 'application/javascript';  
    default:
      return 'text/plain';
  }
};

// Home page route
const homeScene = (res) => {
  const filePath = path.join(__dirname, './HTML/home.html');
  serveHtml(res, filePath);
};

// about page route
const aboutScene = (res) => {
  const filePath = path.join(__dirname, './HTML/about.html');
  serveHtml(res, filePath);
};

// contact page route
const contactScene = (res) => {
  const filePath = path.join(__dirname, './HTML/contact.html');
  serveHtml(res, filePath);
};

// login page route
const loginScene = (res) => {
  const filePath = path.join(__dirname, './HTML/login.html');
  serveHtml(res, filePath);
};

// whyWP page route
const whyWPScene = (res) => {
  const filePath = path.join(__dirname, './HTML/whyWP.html');
  serveHtml(res, filePath);
};


// 404 error page route
const notFoundScene = (res) => {
  const filePath = path.join(__dirname, './HTML/notfound.html');
  serveHtml(res, filePath);
};

const server = createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    homeScene(res);
  } else if(req.url === '/about' && req.method === 'GET'){
    aboutScene(res);
  } else if(req.url === '/whyWP' && req.method === 'GET'){
    whyWPScene(res);
  } else if(req.url === '/login' && req.method === 'GET'){
    loginScene(res);
  } else if(req.url === '/contact' && req.method === 'GET'){
    contactScene(res);
  } else if (req.url.startsWith('/images/') || req.url.endsWith('.css')|| req.url.endsWith('.js')) {
    serveAssets(req, res); // Handle requests for static assets
  } else {
    notFoundScene(res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});




