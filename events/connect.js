const redis_client = require("../redis").getInstance();
const SocketIO = require("socket.io");
const Query = require("../utils/query");
/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * 
 **/
async function handler(io, socket){
    // set online status
    redis_client.hmset(`online_status:${socket.user.username}`, {
        "online": true,
        "last_online": Date.now()
    })
    // join room -- to broadcast to all session of a user
    socket.join(socket.user.username);
    // emit user_came_online
    const related_usernames = await Query.findAllConnectedUsersUsernames(socket.user.username);
    related_usernames.forEach(username => {
        io.to(username).emit("user_came_online", {
            username: socket.user.username
        });
    })
}

module.exports = handler