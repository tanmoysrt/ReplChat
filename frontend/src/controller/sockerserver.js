import { io } from "socket.io-client";
import config from "@/config";


class SocketServer {
    /**
     * @returns {SocketServer}
     */
    static getInstance() {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer();
        }
        return SocketServer.instance;
    }

    init(runFunction) {
        this.socket = io(config.SOCKER_IO_SERVER_URL, {
            auth: {
                token: localStorage.getItem("token") || ""
            },
            timeout: 20000,
            reconnectionAttempts: 100,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        });
        // heartbeat
        setInterval(() => {
            try {
                this.socket.emit("ping");
            } catch (error) {
                console.log("Ping error")
            }
        }, 5000);
        runFunction();
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    emit(event, data, callback) {
        // console.log(this.socket);
        if(!data && !callback) {
            this.socket.emit(event);
            return;
        }
        if(!callback){
            this.socket.emit(event, data);
            return;
        }
        if(callback && !data){
            this.socket.emitWithAck(event).then(r => {
                callback(r);
            })
            return;
        }
        this.socket.emit(event, data, callback);
    }
}

export default SocketServer;