const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

global.allSockets = [];

app.get('/', (req, res) => {
    res.render('room', { online: allSockets.length })
})

io.on('connect', socket => {
    socket.on('join-room', () => {
        allSockets.push({socket: socket, match: -1})
        io.to(socket.id).emit('user-searching')
        findMatch(socket);

        socket.on('disconnect', () => {
            let socketData = getSocketData(socket.id)
            if (socketData !== -1){
                socket.to(socketData.room).emit('client-disconnected')
            }
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
        updateUserMatched(socket.id, true, randomRoom);
        updateUserMatched(unmatched[0].socket.id, true, randomRoom);
    }
    printSockets(socket);
}

function updateUserMatched(socketId, matched, room){
    let matchedSocket = allSockets.filter(socketObj => socketObj.socket.id === socketId);
    if (matchedSocket.length > 0){
        matchedSocket[0].match = (matched) ? 0 : -1;
        matchedSocket[0].client = socketId
        matchedSocket[0].room = room
    }
}

function removeSocket(socketId){
    allSockets.splice(allSockets.findIndex(s => s.socket.id === socketId), 1);
    console.log('hi')
}

function printSockets(socket){
    console.log(`Me : ${socket.id}`);
    allSockets.forEach(socket => {
        console.log(socket.socket.id + " > " + socket.match)
    })
}

function getSocketData(socketId){
    let sockets = allSockets.filter(socketObj => socketObj.socket.id === socketId);
    if (sockets.length > 0){
        return sockets[0]
    } else {
        return -1;
    }
}

server.listen(3000)


