const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

var allSockets = [];

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connect', socket => {
    socket.on('join-room', () => {
        allSockets.push({socket: socket, match: -1})
        io.to(socket.id).emit('user-searching')
        findMatch(socket);

        socket.on('disconnect', () => {
            removeSocket(socket.id)
        })
    })

    socket.on('send-message', (room, message) => {
        socket.to(room).broadcast.emit('message-received', message)
    })
})

function findMatch(socket){
    let unmatched = allSockets.filter(socket => socket.match === -1).filter(socketObj => socketObj.socket.id !== socket.id);
    if (unmatched.length > 0){
        let randomRoom = uuidV4();
        socket.join(randomRoom);
        unmatched[0].socket.join(randomRoom);
        io.to(socket.id).emit('user-matched', randomRoom)
        io.to(unmatched[0].socket.id).emit('user-matched', randomRoom)
        updateUserMatched(socket.id, true);
        updateUserMatched(unmatched[0].socket.id, true);
    }
    console.log('hi')
}

function updateUserMatched(socketId, matched){
    let matchedSocket = allSockets.filter(socketObj => socketObj.socket.id === socketId);
    if (matchedSocket.length > 0){
        matchedSocket[0].match = (matched) ? 0 : -1;
    }
}

function removeSocket(socketId){
    allSockets.splice(allSockets.findIndex(s => s.id === socketId), 1);
}

server.listen(3000)


