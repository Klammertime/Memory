/*
 * Simple web server
 */
"use strict";

// MIME types supported by this server and their corresponding header.
const SUPPORTED_TYPE = {
    '.html': {
        'Content-Type': 'text/html; charset = UTF-8'
    },
    '.txt': {
        'Content-Type': 'text/plain; charset = UTF-8'
    },
    '.js': {
        'Content-Type': 'application/javascript; charset = UTF-8'
    },
    '.appcache': {
        'Content-Type': 'text/cache-manifest; charset = UTF-8',
        'Cache-Control': 'no-cache'
    },
    '.css': {
        'Content-Type': 'text/css; charset = UTF-8'
    },
    '.json': {
        'Content-Type': 'application/json; charset = UTF-8'
    },
    '.gif': {
        'Content-Type': 'image/gif'
    },
    '.png': {
        'Content-Type': 'image/png'
    },
    '.svg': {
        'Content-Type': 'image/svg+xml'
    }
}

// Default type used for unsupported extensions.
const DEFAULT_TYPE = {
    'Content-Type': 'text/plain; charset = UTF-8'
};

// If user does not enter a file name, serve the page home.html.
const HOME = './html/home.html';

// Function will be called whenever the server receives a request.
function servePage(request, response) {
    // Extract the filename and extension from the request.
    var filename = '.' + url.parse(request.url).pathname;

    // If the user does not enter a file name, serve the page home.html.
    if (filename === './') {
        filename = HOME;
    }
    // Get the extension of the requested resource to determine the type.
    var extension = path.extname(filename);
    // Get header corresponding to the extension or default type if extension unsupported.
    var header = SUPPORTED_TYPE[extension] || DEFAULT_TYPE;
    // Read file asynchronously.
    fs.readFile(filename, function(err, content) {
        if (err) { // If error, set status code.
            response.writeHead(404, {
                'Content-Type': 'text/plain, charset = UTF-8'
            });
            response.write(err.message);
            // Include error message body.
            response.write('- The page requested is not found.');
            response.end(); // Done.
        } else { // Otherwise, file read successfully.
            response.writeHead(200, header);
            response.write(content); // Send file contents as response body.
            response.end();
        }
    });
}

// Load url module.
var url = require('url');
// Load path module.
var path = require('path');
// Load file system module.
var fs = require('fs');
// Load http module.
var http = require('http');

// Create a server object
var server = http.createServer(servePage);
server.listen(8080);
console.log('Server running at http://localhost:8080');