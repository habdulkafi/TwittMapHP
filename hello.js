// // // const http = require('http');

// // // const hostname = '127.0.0.1';
// // // const port = 1337;

// // // http.createServer((req, res) => {
// // //   res.writeHead(200, { 'Content-Type': 'text/plain' });
// // //   res.end('Hello World\n');
// // // }).listen(port, hostname, () => {
// // //   console.log(`Server running at http://${hostname}:${port}/`);
// // // });


// // // Load the fs (filesystem) module
// // var fs = require('fs');

// // // Read the contents of the file into memory.
// // fs.readFile('example_log.txt', function (err, logData) {
  
// // // If an error occurred, throwing it will
// //   // display the exception and end our app.
// //   if (err) throw err;
  
// // // logData is a Buffer, convert to string.
// //   var text = logData.toString();

// // var results = {};

// // // Break up the file into lines.
// //   var lines = text.split('\n');
  
// // lines.forEach(function(line) {
// //     var parts = line.split(' ');
// //     var letter = parts[1];
// //     var count = parseInt(parts[2]);
    
// // if(!results[letter]) {
// //       results[letter] = 0;
// //     }
    
// // results[letter] += parseInt(count);
// //   });
  
// // console.log(results);
// //   // { A: 2, B: 14, C: 6 }
// // });



// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(8080);

// console.log('Server running on port 8080.');

var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.listen(8080);
