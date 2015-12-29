var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

http.listen(process.env.PORT, function(){
  console.log('listening on ' + process.env.PORT);
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

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
io.on('connection', function (socket) {
  count += 1;
  socket.broadcast.emit('count', {count: count});
  socket.emit('count', {count: count});

  var hash = socket.id.hashCode();
  var r = hash & 255;
  var g = (hash >> 8) & 255;
  var b = (hash >> 16) & 255;
  var a = (hash >> 24) & 255;
  if (a < 128) {
    a = 128;
  }
  var color = 'rgba('+r+','+g+','+b+','+a+')';
  // Tell the client it's color for local messages.
  socket.emit('color', {color: color});

  socket.on('msg', function(data) {
    data.color = color;
    socket.broadcast.emit('msg', data);
  });

  socket.on('disconnect', function() {
    count -= 1;
    socket.broadcast.emit('count', {count: count});
  })
});

