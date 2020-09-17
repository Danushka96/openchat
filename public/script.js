const socket = io('/')
let matchRoom;
let messageArea = document.getElementById('content')
let sendButton = document.getElementById('send')
let sendAvatar = getRandom();
let receiverAvatar = getRandom();

socket.emit('join-room');

socket.on('user-searching', () => {
    writeToDoc('<div class="center-msg">\n' +
        '            <div>\n' +
        '                <div class="msg-text">\n' +
        '                    Searching for a user.....\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>')
})

socket.on('user-matched', (room) => {
    matchRoom = room
    writeToDoc('<div class="center-msg">\n' +
        '            <div>\n' +
        '                <div class="msg-text">\n' +
        '                    User connected\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>')
    document.getElementById('send').disabled = false
})

socket.on('message-received', (message) => {
    writeToDoc('<div class="msg left-msg">\n' +
        '            <div\n' +
        '                    class="msg-img"\n' +
        '                    style="' + receiverAvatar + '"\n' +
        '            ></div>\n' +
        '\n' +
        '            <div class="msg-bubble">\n' +
        '                <div class="msg-info">\n' +
        '                    <div class="msg-info-name">Stranger</div>\n' +
        '                    <div class="msg-info-time">'+getCurrentTime()+'</div>\n' +
        '                </div>\n' +
        '\n' +
        '                <div class="msg-text">\n' +
        message +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>')
    scrollToBottom();
})

socket.on('client-disconnected', () => {
    writeToDoc('<div class="center-msg">\n' +
        '            <div>\n' +
        '                <div class="msg-text">\n' +
        '                    User disconnected\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>')
    writeToDoc('<div class="center-msg">\n' +
        '            <div>\n' +
        '                <div class="msg-text">\n' +
        '                    <button class="msger-send-btn" id="reconnect">Reconnect</button>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>')
    document.getElementById('send').disabled = true
    console.log('disconnected')
    document.getElementById('reconnect').onclick = function (){
        location.reload();
    }
})

sendButton.onclick = function (){
    // console.log(messageArea.value)
    writeToDoc('<div class="msg right-msg">\n' +
        '            <div\n' +
        '                    class="msg-img"\n' +
        '                    style="' + sendAvatar + '"\n' +
        '            ></div>\n' +
        '\n' +
        '            <div class="msg-bubble">\n' +
        '                <div class="msg-info">\n' +
        '                    <div class="msg-info-name">me</div>\n' +
        '                    <div class="msg-info-time">'+getCurrentTime()+'</div>\n' +
        '                </div>\n' +
        '\n' +
        '                <div class="msg-text">\n' +
        messageArea.value +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>')
    socket.emit('send-message', matchRoom, messageArea.value)
    messageArea.value = ''
    scrollToBottom();
}

function writeToDoc(content){
    document.getElementById('message-section').innerHTML += content
}

function getCurrentTime(){
    var d = new Date(); // for now
    return d.getHours() + ':' + d.getMinutes();
}

function getRandom(){
    let rNumber = Math.floor(Math.random() * Math.floor(50)) + 1;
    return `background-image: url(/svg/${rNumber}.svg)`
}

function scrollToBottom(){
    let messageContainer = document.getElementById('message-section');
    messageContainer.scrollTop = messageContainer.scrollHeight
}
