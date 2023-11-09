const url = require('url');
const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello Node!\n');
  let addr = request.url;
  let q = new URL(addr,'http://localhost:8080');
  let filepath = '';
  

  

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  if(q.pathname.includes('documentation'))
  {
      filepath = (__dirname + '/documenation.html');}
      else {
        filepath = 'index.html';
      }


      fs.readFile(filePath, (err, data) => {
        if (err) {
          throw err;
        }
    
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    
      });
      

 
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');