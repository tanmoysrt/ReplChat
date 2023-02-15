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
    }

    fetchChatList(){
        this.socketServer.emit("list_chats", null, (data) => {
            if(data.success){
                this.setChatList(data["data"].map(chat => Chat.fromJson(chat)));
            }
        })
    }

    listenerForNewChat(){
        this.socketServer.on("new_chat_added", (data) => {
            this.setChatList([...this.chatList, Chat.fromJson(data)]);
        })
    }

}

export default SocketIOController