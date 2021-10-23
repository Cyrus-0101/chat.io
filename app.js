var dotenv = require('dotenv').config(

);


var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// App Middleware.
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGODB_URI;

// Message Model.
var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// App Routes
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

// Setting up socket.io connection.
io.on('connection', (socket) => {
    console.log('A User Connected!');
});

// Connecting to MongoDB.

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Getting default connection.
var db = mongoose.connection;

// Binding the mongoose connection to an error event.
// Better error handling.
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
db.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:')
);

var server = http.listen(process.env.PORT, () => {
    console.log('App listening on port', server.address().port);
});