import Swal from "sweetalert2";
import SocketServer from "./sockerserver";
import Chat from  "@/models/chat";

class SocketIOController{
    /**
     * @param {Chat[]} chatList
     * @param {function([])} setChatList 
     * @param {{}} userOnlineStatusData
     * @param {function({})} setUserOnlineStatusData
     * @param {[]} currentChatDetails 
     * @param {function([])} setCurrentChatDetails 
     * @param {[]} currentChatMessages 
     * @param {function([])} setCurrentChatMessages 
     */
    constructor(
        chatList, setChatList, 
        userOnlineStatusData, setUserOnlineStatusData, 
        currentChatDetails, setCurrentChatDetails,
        currentChatMessages, setCurrentChatMessages,                
        ){
        this.chatList = chatList;
        this.setChatList = setChatList;
        this.userOnlineStatusData = userOnlineStatusData;
        this.setUserOnlineStatusData = setUserOnlineStatusData;
        this.currentChatDetails = currentChatDetails;
        this.setCurrentChatDetails = setCurrentChatDetails;
        this.currentChatMessages = currentChatMessages;
        this.setCurrentChatMessages = setCurrentChatMessages;
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
            this.setChatList([...this.chatList, Chat.fromJson(data)]);
        })
    }

    listenerForOnlineStatusUpdate(){
        this.socketServer.on("user_came_online", (data) => {
            this.setUserOnlineStatusData({
                ...this.userOnlineStatusData,
                [data.username]: true
            })
        })
    }

    listenerForOfflineStatusUpdate(){
        this.socketServer.on("user_gone_offline", (data) => {
            this.setUserOnlineStatusData({
                ...this.userOnlineStatusData,
                [data.username]: false
            })
        })
    }
}

export default SocketIOController