const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));

let clients = 0;

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('Client2')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('peer2', SendOffer)
    socket.on('peer1', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("Client1", offer)
    //console.log(offer);
}

function SendAnswer(data) {
    this.broadcast.emit("Answer", data)
   // console.log(data);
}


http.listen(port, () => console.log(`Active on ${port} port`))