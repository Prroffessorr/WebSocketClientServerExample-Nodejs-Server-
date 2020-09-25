const status = document.getElementById('status');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = connectionOpen;
ws.onmessage = messageReceived;
ws.onerror = errorOccurred;
ws.onclose = connectionClosed;

function setStatus(value) {
    status.innerHTML = value.value;
}

function printMessage(value) {
    const li = document.createElement('li');
    li.innerHTML = value;
    messages.appendChild(li);
}

form.addEventListener('submit', e=>{
    e.preventDefault();
    ws.send(input.value);
    printMessage("Message: "+input.value);
    input.value='';
})

function connectionOpen(e) {
    status.innerHTML = "CONNECTION OPEN";
    if(e.data!=null){
        printMessage("Message: "+e.data);
    }  
}

function messageReceived(e) {
    printMessage("Client Message: "+ e.data);
}

function connectionClosed(){
    status.innerHTML = "CONNECTION CLOSE";
}

function errorOccurred() {
    printMessage("CONNECTION ERROR");
}

//little foolproof (auto reconnection after page reload)
if (performance.navigation.type == 1) {
    connectionClosed();
}