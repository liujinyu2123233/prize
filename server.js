
var express = require('express');
var app = express();

app.get('*',function(req,res){
    res.sendfile(__dirname+'/io.html')
})


var server = require('http').createServer(app)
server.listen(4040)
var io = require('socket.io')(server);

io.on('connection',function(socket){
    //连接成功
    console.log('链接成功')
    socket.send('hello client')
    socket.on('disconnect',function(){
        //用户已经离开...
        console.log('用户已经离开')

    });
    socket.on('message',function(msg){
        console.log(msg);
        socket.send('confirm:'+msg)
    })
});