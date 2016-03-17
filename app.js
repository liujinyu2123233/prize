var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').createServer(app)
server.listen(3030)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//
var prizeDatas = 23;
//
var relPrize = {'1':'一等奖','2':'二等奖','3':'三等奖'}
var peopleData = [];
var userNum = 0;
//websocket即时通信 服务
var io = require('socket.io')(server);
io.of('myroom').on('connection',function(socket){
  //连接成功
  socket.broadcast.emit('message','hello client')

  socket.on('message',function(msg){
    if(!msg.name)return;
    console.log(msg);
    peopleData.push(msg);
    socket.broadcast.emit('allpeo',peopleData)
    socket.broadcast.emit('newpeo',msg)

  })
  socket.on('warning',function(msg){
    console.error(msg);
  })

  //socket.on('disconnect',function(){
  //  //用户已经离开...
  //  //console.log('用户已经离开')
  //});
});


app.post('/getdata',function(req,res,next){
  req.setEncoding('utf8');
  res.setHeader('Access-Control-Allow-Origin','*');


  req.on('data',function(str){
    var json = JSON.parse(str||'');
    console.log(json)
    res.end(str);

  })

})
app.get('/show',function(req,res){
  res.sendfile(path.join(__dirname,'/views/show.html'));
})
app.get('/login',function(req,res){
  res.render('login');
})
app.get('/prize', function (req, res) {
  res.render('prize')
})
app.get('*',function(req,res){
  fs.readFile(__dirname+req.url,function(err,cont){
    res.end(cont)
  })


})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
