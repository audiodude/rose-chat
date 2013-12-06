var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

app.listen(5000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var count = 0;
io.sockets.on('connection', function (socket) {
  count += 1;
  socket.broadcast.emit('count', {count: count});
  socket.emit('count', {count: count});

  socket.on('msg', function(data) {
    socket.broadcast.emit('msg', data);
  });

  socket.on('disconnect', function() {
    count -= 1;
    socket.broadcast.emit('count', {count: count});
  })
});

