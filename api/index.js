const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const { url, method } = req;

  const serveHtml = (filePath) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.status(500).send('<h1>Error loading the page.</h1>');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(data);
    });
  };

  const routes = {
    '/': './public/HTML/home.html',
    '/about': './public/HTML/about.html',
    '/whyWP': './public/HTML/whyWP.html',
    '/login': './public/HTML/login.html',
    '/contact': './public/HTML/contact.html',
    '404': './public/HTML/notfound.html',
  };

  if (method === 'GET') {
    const filePath = routes[url] || routes['404'];
    serveHtml(path.join(process.cwd(), filePath));
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
