import Swal from "sweetalert2";
import SocketServer from "./sockerserver";
import Chat from  "@/models/chat";
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
     * @param {[]} currentChatMessages
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

    init(){
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

    listenerForNewChat(){
        this.socketServer.on("new_chat_added", (data) => {
            this.setChatList([...this.chatListRef.current, Chat.fromJson(data)]);
            this.fetchUserOnlineStatusData();
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

    chooseChat(chatId){
        this.setCurrentChatId(chatId);
        // this.fetchChatMessages(chatId);
    }
}

export default SocketIOController