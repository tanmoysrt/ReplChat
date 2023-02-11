const redis_client = require("../redis").getInstance();
const SocketIO = require("socket.io");

/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * 
 **/
function handler(io, socket){
    socket.on("ping", () => {
        // set online status
        redis_client.hmset(`online_status:${socket.user.username}`, {
            "online": true,
            "last_online": Date.now()
        })
    })
}

module.exports = handler