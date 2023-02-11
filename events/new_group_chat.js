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
    socket.on("new_group_chat", async ({name}, callback) => {
        const chat_record = await prisma.chatRecord.create({
            data: {
                name: name,
                is_group_chat: true,
                users: {
                    connect: [
                        {
                            id: socket.user.id
                        }
                    ]
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
        callback({
            success: true,
            message: "Chat created successfully"
        })
        // send notification regarding new_chat with new_chat_added event
        let payload_for_current_user = JSON.parse(JSON.stringify(chat_record));
        io.to(socket.user.username).emit("new_chat_added", payload_for_current_user);
    })
}

module.exports = handler