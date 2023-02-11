const redis_client = require("../redis").getInstance();
const SocketIO = require("socket.io");
const Query = require("../utils/query");

/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * 
 **/
function handler(io, socket){
    socket.on("disconnect", async() => {
        // check no active session of user exists
        if(io.of("/").adapter.rooms.get(socket.user.username) == undefined){
            redis_client.hmset(`online_status:${socket.user.username}`, {
                "online": false
            })
            // emit user_gone_offline
            const related_usernames = await Query.findAllConnectedUsers(socket.user.username);
            related_usernames.forEach(username => {
                io.to(username).emit("user_gone_offline", {
                    username: socket.user.username
                });
            })
        }
    })
}

module.exports = handler