var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const uri = 'mongodb+srv://cyrus:Y1B97SO21fuMmiI7@cluster0-xp4l4.mongodb.net/chat-socket?retryWrites=true&w=majority';

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if (err)
            sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })
});

io.on('connection', (socket) => {
    console.log('A User Connected!');
});

mongoose.connect(uri,  (err) => {
    console.log('DB Connected.', err);
});

var server = http.listen(3000, () => {
    console.log('App listening on port', server.address().port);
});