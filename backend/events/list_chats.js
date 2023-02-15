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
    socket.on("list_chats", async(callback) => {
        let chat_records = await prisma.chatRecord.findMany({
            where: {
                users: {
                    some: {
                        username: socket.user.username
                    }
                }
            },
            select: {
                id: true,
                name: true,
                is_group_chat: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                }
            }
        })
        for (let i = 0; i < chat_records.length; i++) {
            chat_records[i].users = chat_records[i].users.filter(user => user.username !== socket.user.username)
            
        }
        callback({
            success: true,
            data: chat_records
        })
    })
}

module.exports = handler