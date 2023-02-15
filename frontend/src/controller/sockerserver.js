import { io } from "socket.io-client";
import config from "@/config";


class SocketServer {
    init() {
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
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    emit(event, data, callback) {
        if(!data) {
            this.socket.emit(event);
            return;
        }
        if(!callback){
            this.socket.emit(event, data);
            return;
        }
        this.socket.emit(event, data, callback);
    }
}

export default SocketServer;