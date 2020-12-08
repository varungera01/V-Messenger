//const session = require('express-session');

//const ejs = require('ejs');


const socket = io();
const room = Qs.parse(location.search , { ignoreQueryPrefix : true});

console.log(room);


const socket = io("localhost:3000" , {
    reconnectionDelayMax: 10000,
    query : {
        room : room
    }
});

let textarea = document.querySelector('#textarea');

let messageArea = document.querySelector('.message-area');


/*do{
    name = prompt('Please enter your name');
}while(!name);
*c*/
//let name = '<%= name %>'

let name =  '<%- JSON.stringify(data) %>';

console.log(name);

textarea.addEventListener('keyup' , (e) => {

    if(e.key === 'Enter')
        sendMessage(e.target.value);
});

var flag = 0;

textarea.addEventListener("keypress" ,() => {

    socket.emit('typing'  , {
        name : name

    });
});

/////////////////////////////////////////

function sendMessage(message){

    let msg = {
        user : name,
        message : message.trim()
    };

    appendMessage(msg , 'outgoing');

    scrollToBottom();

    textarea.value = ' ';



    socket.emit('message' , {
        user : name,
        message : message,
    });

}
///////////////////////////////////////////////////////

function appendMessage(message , type){


    let mainDiv = document.createElement('div');

    let className = type;

    mainDiv.classList.add(className , 'message');

    let markup = `
      <h5>${message.user}</h5>
      <p>${message.message}</p>

    `

    mainDiv.innerHTML = markup;

    messageArea.append(mainDiv);  
}

//////////////////////////////////////////////////////////////////////////



socket.on('message' , (msg) => {
      appendMessage(msg , 'incoming');
      scrollToBottom();
});

socket.on('typing' , (name) => {
    console.log(name + ' is typing');
});

function scrollToBottom(){

    messageArea.scrollTop = messageArea.scrollHeight;
}