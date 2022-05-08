var express = require('express'); // for running a server
var bodyParser = require('body-parser'); // for processing JSON submitted in the request body
var Pusher = require('pusher'); // for connecting to Pusher

require('dotenv').config();

var app = express();
app.use(bodyParser.json()); // for parsing JSON strings passed in the request body
app.use(bodyParser.urlencoded({ extended: false })); // for parsing URL encoded request body

var pusher = new Pusher({ // connect to pusher
  appId: process.env.APP_ID, // load the Pusher app settings from the .env file
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
});

app.get('/', function (req, res) { // for testing if the server is running
  res.send('everything is good...');
});

app.post('/pusher/auth', function (req, res) { // authenticate user's who's trying to connect
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

var port = process.env.PORT || 5000;
app.listen(port);