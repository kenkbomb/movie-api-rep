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
      console.log('Added to log.' + filepath);
    }
  });

  if(q.pathname.includes('documentation.html'))
  {
      filepath = (__dirname + '/documentation.html');
      console.log(filepath);
    
    }
      else {
        filepath = 'index.html';
      }


      fs.readFile(filepath, (err, data) => {
        if (err) {
          throw err;
        }
    
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    
      });
      

 
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');