// Shows a message with x/y coords encapsulated in an object. Split out here so
// that it can be used to show our own messages as well as received ones.
function showMessage(data) {
  var el = $('<div class="msg"></div>')
  // This should escape HTML and protect us against XSS.
  $(el).text(data.msg);
  $(el).css({'left': data.x + 'px', 'top': data.y + 'px'});
  $('#area').append(el)
}

var socket = io.connect('http://rose.0-z-0.com');

// Show received messages.
socket.on('msg', function(data) {
  showMessage(data);
});

// Update the count when count messages are received.
socket.on('count', function(data) {
  $('#count').html(data.count);
});

current_cont = null;
function onAreaClicked(evt) {
  // Don't allow multiple input containers at once.
  if (current_cont) {
    $(current_cont).remove();
  }

  var cont = $('<div class="input_cont"><input/><button>send</button></div>');
  $(cont).css({'left': evt.offsetX + 'px', 'top': evt.offsetY + 'px'});
  // Don't count clicks on the input container as clicks on the area.
  $(cont).click(function(input_evt) {
    input_evt.stopPropagation();
  });
  var button = $(cont).find('button');
  var input = $(cont).find('input');

  // Clicking the button sends the message.
  button.click(function() {
    var msgData = {
      x: evt.offsetX,
      y: evt.offsetY,
      msg: input.val()
    }
    socket.emit('msg', msgData);
    showMessage(msgData);  //See your own messages.
    // Without the timeout, the container would be removed before it could stop
    // propagation on the button click and a ghost input would form.
    window.setTimeout(function() { $(cont).remove(); }, 0);
  });

  // Send message when ENTER key is pressed.
  input.keyup(function(event){
    if(event.keyCode == 13){
      button.click();
    }
  });

  current_cont = cont;
  $('#area').append(cont);
  input.focus();
}

function init() {
  $('#area').click(onAreaClicked);
}

$(document).ready( function() { init(); } );