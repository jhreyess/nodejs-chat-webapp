document.addEventListener("DOMContentLoaded", function(){

    const socket = io();

    const chatBox = document.getElementById('chatBox');
    const mainPage = document.getElementById('mainPage');
    chatBox.style.display = 'none';

    //obtaining DOM elements from the interface
    const nicknameForm = document.getElementById('nickname-form');
    const nicknameBox = document.getElementById('nickname');

    const messageForm = document.getElementById('message-form');
    const messageBox = document.getElementById('message');
    const chat = document.getElementById('chat');
    const users = document.getElementById('users');
    
    //events
    nicknameForm.addEventListener("submit", e => {
        e.preventDefault();
        if(nicknameBox.value && nicknameBox.value.trim()!=="" ){
            socket.emit('new user', nicknameBox.value, callback => {
                if(callback){
                    mainPage.style.display = 'none';
                    chatBox.style.display = 'inherit';
                }else{
                    alert("Usuario en uso!");
                }
                nicknameBox.value = "";
            });
        }
    });

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if(messageBox.value && messageBox.value.trim()!=="" ){
            socket.emit('send message', messageBox.value);
            messageBox.value="";
        }
    });

    socket.on('conected', nick => {
        chat.innerHTML += `<span>${nick} has joined the chat group!<span/><br/>`;
    });

    socket.on('disconected', nick => {
        chat.innerHTML += `<span>${nick} has left the chat!</span><br/>`;
    });

    socket.on('usernames', nicks => {
        let html = '';
        nicks.forEach(nick => {
            html += `<h5 class="onlineUser">${nick}</h5>`;
        });
        users.innerHTML = html;
    });

    socket.on('new message', (data)=>{
        let shouldScroll = chat.scrollTop + chat.clientHeight == chat.scrollHeight;
        chat.innerHTML += `<strong>${data.user}:</strong> ${data.msg}<br/>`;
        if(!shouldScroll){
            scrollToBottom();
        }

    })
});

function scrollToBottom(){
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
}