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
    socket.on("fetch_all_status", async(callback) => {
        // find all connected users
        let connected_users_username = await Query.findAllConnectedUsersUsernames(socket.user.username);
        connected_users_username = connected_users_username.filter(username => username != socket.user.username);
        // fetch all online status
        let data = [];
        for(let i = 0; i < connected_users_username.length; i++){
            const username = connected_users_username[i];
            const online_status = await redis_client.hgetall(`online_status:${username}`);
            data.push({
                username: username,
                online: online_status.online == "true",
                last_online: parseInt(online_status.last_online)
            })
        }

        callback({
            "success": true,
            "data": data
        })
    })

}

module.exports = handler