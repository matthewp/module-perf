const fs = require('fs');
const path = require('path');
const http2 = require('http2');

const serverOptions = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt')
};

fs.readdir('./src', (err, files) => {
  makeServer(files);
});

function makeServer(moduleFiles) {
  const cachedFile = fs.readFileSync(path.join(__dirname, 'module.html'));
  const moduleCache = new Map();

  moduleFiles.forEach(filename => {
    let pth = path.join(__dirname, 'src', filename);
    let src = fs.readFileSync(pth, 'utf8');
    moduleCache.set(`/src/${filename}`, src);
  });

  const handler = (req, res) => {
    const url = req.url;

    if(url === '/') {
      moduleFiles.forEach(filename => {
        let serverPath = `/src/${filename}`;

        let push = res.push(serverPath, {
          status: 200,
          method: 'GET',
          request: {
            accept: '*/*'
          },
          response: {
            'content-type': 'application/javascript'
          }
        });

        push.end(moduleCache.get(serverPath));
      });

      res.end(cachedFile);
    } else if (url.includes('/src')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(moduleCache.get(url));
    } else {
      res.writeHead(404);
      res.end();
    }
  };

  const server = http2.createServer(serverOptions, handler);
  server.listen(3000);
}


