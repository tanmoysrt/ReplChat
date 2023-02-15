import Swal from "sweetalert2";
import SocketServer from "./sockerserver";
import Chat from  "@/models/chat";
import Message from  "@/models/message";
import {useRef} from "react";

class SocketIOController{
    /**
     * @param {Chat[]} chatList
     * @param {function([])} setChatList
     * @param chatListRef
     * @param {{}} userOnlineStatusData
     * @param {function({})} setUserOnlineStatusData
     * @param userOnlineStatusDataRef
     * @param {string} currentChatId
     * @param {function(string)} setCurrentChatId
     * @param currentChatIdRef
     * @param {Message[]} currentChatMessages
     * @param {function([])} setCurrentChatMessages
     * @param currentChatMessagesRef
     */
    constructor(
        chatList, setChatList, chatListRef,
        userOnlineStatusData, setUserOnlineStatusData, userOnlineStatusDataRef,
        currentChatId, setCurrentChatId, currentChatIdRef,
        currentChatMessages, setCurrentChatMessages, currentChatMessagesRef,
        dataRef
        ){
        this.dataRef = dataRef;
        this.chatList = chatList;
        this.setChatList = setChatList;
        this.chatListRef = chatListRef;
        this.userOnlineStatusData = userOnlineStatusData;
        this.setUserOnlineStatusData = setUserOnlineStatusData;
        this.userOnlineStatusDataRef = userOnlineStatusDataRef;
        this.currentChatId = currentChatId;
        this.setCurrentChatId = setCurrentChatId;
        this.currentChatIdRef = currentChatIdRef;
        this.currentChatMessages = currentChatMessages;
        this.setCurrentChatMessages = setCurrentChatMessages;
        this.currentChatMessagesRef = currentChatMessagesRef;
        this.socketServer = SocketServer.getInstance();
    }




    init(token){
        const token_details = this.parseJwt(token);
        this.dataRef.current.user.username = token_details.username;
        this.dataRef.current.user.name = token_details.name;
        this.socketServer.init(()=>{
            this.socketServer.socket.once("connect", () => {
                this.startListeners();
                this.fetchChatList();
                this.fetchUserOnlineStatusData();
            })
        });
    }

    initNewChat(username){
        this.socketServer.emit("new_chat", {
            username: username
        }, (data) => {
            if(data.success){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Chat Created'
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error || 'Something went wrong!',
                })
            }
        })
    }

    startListeners(){
        this.listenerForNewChat();
        this.listenerForOnlineStatusUpdate();
        this.listenerForOfflineStatusUpdate();
        this.listenerForTypingUpdate();
        this.listenerForNewMessage();
    }

    fetchChatList(){
        this.socketServer.emit("list_chats", null, (data) => {
            if(data.success){
                this.setChatList(data["data"].map(chat => Chat.fromJson(chat)));
            }
        })
    }

    fetchUserOnlineStatusData(){
        this.socketServer.emit("fetch_all_status", null, (data) => {
            if(data.success){
                const status_data = data["data"];
                let status_data_obj = {};
                // TODO: add a timestamp limit
                const timestamp_limit = Date.now() - 10000;
                for(let i=0; i<status_data.length; i++){
                    status_data_obj[status_data[i].username] = status_data[i].online;
                }
                this.setUserOnlineStatusData(status_data_obj);
            }
        })
    }

    fetchCurrentChatMessages(){
        console.log(this.currentChatIdRef.current)
        this.socketServer.emit("fetch_messages", {
            "chat_id": this.currentChatIdRef.current
        }, (data)=>{
            console.log(data)
            if(data.success){
                const messages = data["data"].map(message => Message.fromJSON(message));
                this.setCurrentChatMessages(messages);
                setTimeout(()=>{
                    this.scrollToBottom();
                }, 100)
            }
        })
    }

    listenerForNewChat(){
        this.socketServer.on("new_chat_added", (data) => {
            this.setChatList([...this.chatListRef.current, Chat.fromJson(data)]);
            this.fetchUserOnlineStatusData();
        })
    }

    listenerForNewMessage(){
        this.socketServer.on("new_message_added", (data)=>{
            this.actOnNewIncomingMessage(data["chat_id"], data["data"])
        })
    }

    listenerForOnlineStatusUpdate(){
        this.socketServer.on("user_came_online", (data) => {
            this.setUserOnlineStatusData({
                ...this.userOnlineStatusDataRef.current,
                [data.username]: true
            })
        })
    }

    listenerForOfflineStatusUpdate(){
        this.socketServer.on("user_gone_offline", (data) => {
            this.setUserOnlineStatusData({
                ...this.userOnlineStatusDataRef.current,
                [data.username]: false
            })
        })
    }

    listenerForTypingUpdate(){
        this.socketServer.on("typing_update", (data) => {
            const chat =  this.getChatDetailsById(data["chat_id"]);
            chat.typing = true;
            chat.typing_name = data["name"];
            if(chat.typing_timeout_ref){
                clearTimeout(chat.typing_timeout_ref);
            }
            chat.typing_timeout_ref = setTimeout(() => {
                chat.typing = false;
                chat.typing_name = "";
                this.setChatList([...this.chatListRef.current]);
            }, 2000);
            this.setChatList([...this.chatListRef.current]);
        })
    }

    getChatDetailsById(chatId){
        return this.chatListRef.current.find(chat => chat.id === chatId);
    }

    sendTypingUpdate(){
        this.socketServer.emit("typing", {
            "chat_id" : this.currentChatIdRef.current
        })
    }

    sendTextMessage(){
        const text = this.dataRef.current.message.text;
        this.dataRef.current.message.text = "";
        if(text.trim() === "") return;
        document.getElementById("text_input_box_chat").value = "";
        this.socketServer.emit("new_message", {
            "chat_id": this.currentChatIdRef.current,
            "message_type": "TEXT",
            "text_content": text,
            "file_stored_name":  null,
            "file_name":  null,
            "file_mime_type":  null
        }, (data)=>{
            this.dataRef.current.message.text = "";
            if(data.success){
                this.actOnNewIncomingMessage(this.currentChatIdRef.current, data.data);
            }
        })
    }

    actOnNewIncomingMessage(chatId, data){
        if(this.currentChatIdRef.current === chatId){
            const message = Message.fromJSON(data);
            this.setCurrentChatMessages([...this.currentChatMessagesRef.current, message]);
        }

        const chat = this.getChatDetailsById(chatId);
        chat.last_message_text = data.text_content;
        chat.last_message_time = data.created_at;

        this.setChatList([...this.chatListRef.current]);
        setTimeout(()=>{
            this.scrollToBottom();
        }, 100)
    }

    chooseChat(chatId){
        this.dataRef.current.message.text = "";
        this.setCurrentChatMessages([]);
        this.setCurrentChatId(chatId);
        this.currentChatIdRef.current = chatId;
        this.fetchCurrentChatMessages();
    }

    // Decode JWT Token
    // collected from : https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    scrollToBottom(){
        const chatWindow = document.getElementById('message_box');
        if(!chatWindow) return;
        chatWindow.scrollTo(0, chatWindow.scrollHeight);
    }
}

export default SocketIOController