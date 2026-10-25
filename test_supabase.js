const https = require('https');

const options = {
  hostname: 'mwqohvrgimpfyduaxrow.supabase.co',
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cW9odnJnaW1wZnlkdWF4cm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjY2NDksImV4cCI6MjEwODUwMjY0OX0.i6TiH_15wKEdED7wQEzxkXbOlikt0d1RQmZXqjrltTw',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cW9odnJnaW1wZnlkdWF4cm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjY2NDksImV4cCI6MjEwODUwMjY0OX0.i6TiH_15wKEdED7wQEzxkXbOlikt0d1RQmZXqjrltTw'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('TABLES_FOUND:', Object.keys(parsed.definitions || {}));
    } catch(e) {
      console.log('RESPONSE:', data.slice(0, 300));
    }
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.end();
