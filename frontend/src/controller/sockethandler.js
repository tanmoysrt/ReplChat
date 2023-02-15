import Swal from "sweetalert2";
import SocketServer from "./sockerserver";

class SocketIOController{
    /**
     * @param {[]} chatList 
     * @param {function([])} setChatList 
     * @param {[]} userOnlineStatusData 
     * @param {function([])} setUserOnlineStatusData 
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
        this.socketServer = new SocketServer();
    }

    init(){
        this.socketServer.init();
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


}

export default SocketIOController