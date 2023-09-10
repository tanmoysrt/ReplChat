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
            const related_usernames = await Query.findAllConnectedUsersUsernames(socket.user.username);
            io.to(related_usernames).except(socket.user.username).emit("user_gone_offline", {
                username: socket.user.username
            });
        }
    })
}

module.exports = handler