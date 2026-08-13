const http = require('http');

const data = JSON.stringify({
  name: 'Test User',
  email: 'testuser@gmail.com',
  password: 'Test@1234'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (error) => {
  console.error('Request failed:', error.message);
});

req.write(data);
req.end();
