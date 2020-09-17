const socket = io('/')
let matchRoom;
let messageArea = document.getElementById('content')
let sendButton = document.getElementById('send')

socket.emit('join-room', ROOM_ID, 10);

writeToDoc("abc");

socket.on('user-searching', () => {
    writeToDoc('Searching for a user')
})

socket.on('user-matched', (room) => {
    matchRoom = room
    writeToDoc('user matched')
})

socket.on('message-received', (message) => {
    writeToDoc(message)
})

function writeToDoc(content){
    document.getElementById('video-grid').append(content)
}

sendButton.onclick = function (){
    // console.log(messageArea.value)
    socket.emit('send-message', matchRoom, messageArea.value)
    messageArea.value = ''
}
