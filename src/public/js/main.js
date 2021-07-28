document.addEventListener("DOMContentLoaded", function(){

    const socket = io();

    const chatBox = document.getElementById('chatBox');
    const mainPage = document.getElementById('mainPage');

    //obtaining DOM elements from the interface
    const nicknameForm = document.getElementById('nickname-form');
    const nicknameBox = document.getElementById('nickname');

    const messageForm = document.getElementById('message-form');
    const messageBox = document.getElementById('message-input');
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
            messageBox.value = messageBox.value.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt");
            let shouldScroll = Math.round(chat.scrollTop)+chat.clientHeight === chat.scrollHeight;
            chat.innerHTML += `<div class="message sent"><p>`+messageBox.value+'</p></message>';
            socket.emit('send message', messageBox.value);
            if(shouldScroll){ scrollToBottom(); }
            messageBox.value="";
        }
    });

    socket.on('conected', (nick) => {
        chat.innerHTML += `<div class="message"><span>${nick} has joined the chat group!<span/></div>`;
    });

    socket.on('disconected', (nick) => {
        chat.innerHTML += `<div class="message"><span>${nick} has left the chat!</span></div>`;
    });

    socket.on('usernames', (nicks) => {
        let html = '';
        nicks.forEach(nick => {
            html += `<div class="onlineUser"><div class="onlineIcon"></div><h5>${nick}</h5></div>`;
        });
        users.innerHTML = html;
    });

    socket.on('new message', (data)=>{
        console.log("testing");
        let shouldScroll = Math.round(chat.scrollTop)+chat.clientHeight === chat.scrollHeight;
        chat.innerHTML += `<div class="message"><strong>${data.user}</strong><p>`+data.msg+'</p></message>';
        if(shouldScroll){ scrollToBottom(); }
    });
});

function scrollToBottom(){
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
}