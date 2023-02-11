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
    socket.on("delete_message", async ({message_id}, callback) => {
        const message = await prisma.message.findFirst({
            where: {
                id: message_id,
                chat: {
                    users: {
                        some: {
                            id: socket.user.id
                        }
                    }
                }
            },
            select: {
                id: true,
                sender_id: true,
                chat: {
                    select: {
                        id: true,
                        users: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        })
        if(!message){
            callback({
                "success": false,
                "message": "Message not found"
            })
            return;
        }
        if(message.sender_id != socket.user.id){
            callback({
                "success": false,
                "message": "You are not the sender of this message"
            })
            return;
        }
        await prisma.message.delete({
            where: {
                id: message.id
            }
        })
        callback({
            "success": true,
            "message": "Message deleted"
        })
        // all usernames
        const usernames = message.chat.users.map(user => user.username);
        // send except self
        io.to(usernames).except(socket.user.username).emit("message_deleted", {
            "message_id": message.id,
            "chat_id": message.chat.id
        })
    })
}

module.exports = handler