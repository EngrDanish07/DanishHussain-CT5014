const request = require('http'); // Use built-in 'http' module for requests
const server = require('./index'); // Import the raw server instance
// We will use a variable to store the dynamically assigned port
let testPort;
let testURL;

describe('Node.js Hello World Server', () => {
  beforeAll((done) => {
    server.on('error', (err) => {
      console.error('Server failed to start:', err.message);
      done(err);
    });
    // Start the server on port 0 to get an OS-assigned free port
    server.listen(0, () => {
      testPort = server.address().port;
      testURL = `http://localhost:${testPort}`;
      console.log(`Test server successfully started on dynamic port ${testPort}`);
      done();
    });
  });

  test('should return "Hello World\\n" and status 200', (done) => {
    request.get(testURL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          expect(res.statusCode).toBe(200);
          expect(data).toBe('Hello World\n');
          done();
        } catch (error) {
          done(error);
        }
      });
    }).on("error", (err) => {
      console.error('Connection error during test:', err.message);
      done(err);
    });
  });

  afterAll((done) => {
    server.removeAllListeners('error');
    server.close((err) => {
      console.log("Test server stopped.");
      done(err);
    });
  });
});
