var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var url = "mongodb://localhost/ng2socket" ;

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var cors = require('cors');

var chat = require("./schema/chats.model");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use('/', index);
app.use('/users', users);


// socket.io
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(4000);

//Connection to mongoose 

mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongoose successfully connected");
});

app.get("/loadallchats", function(req,res){
       chat.find({}).exec(function(err,msgs){
        if(err) { res.send("Error has occured!")}
        else {
            console.log(msgs);
            res.json(msgs);
        }
    });
});

io.on('connection', function (socket) {
  console.log("An user connected");
  socket.on('save-message', function(data){
    console.log(data);
    var newMsg = new chat(data);
    newMsg.save(function(err,doc){
         if(err) {res.send("Error adding record");}
         console.log(doc);
         io.emit('new-message', data); 
    });
  //  io.emit('new-message', data);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
