const redis_client = require("../redis").getInstance();
const SocketIO = require("socket.io");
const Query = require("../utils/query");
const prisma = require("../db").getInstance();


/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * 
 **/
function handler(io, socket){

    socket.on("typing", async ({chat_id}) => {
        const connected_usernames = await Query.findAllConnectedUsersUsernames(socket.user.username, chat_id);
        const connected_usernames_except_me = connected_usernames.filter(username => username != socket.user.username);
        connected_usernames_except_me.forEach(username => {
            io.to(username).emit("typing_update", {
                "chat_id": chat_id,
                "username": socket.user.username,
                "name": socket.user.name
            })
        })
    })

}

module.exports = handler