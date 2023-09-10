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
    socket.on("new_message", async (data, callback) => {
        const chat_id = data.chat_id;
        const chat = await prisma.chatRecord.findFirst({
            where: {
                id: chat_id,
                users: {
                    some: {
                        username: socket.user.username
                    }
                }
            },
            select: {
                id: true,
                users: {
                    select: {
                        username: true
                    }
                }
            }
        });
        if (!chat) {
            callback({
                "success": false,
                "message": "Chat not found"
            })
            return;
        }
        const new_message = await prisma.message.create({
            data: {
                chat: {
                    connect: {
                        id: chat_id
                    }
                },
                sender: {
                    connect: {
                        id: socket.user.id
                    }
                },
                is_notification_message: false,
                message_type: data.message_type,
                text_content: data.text_content || "",
                file_stored_name: data.file_stored_name || null,
                file_name: data.file_name || null,
                file_mime_type: data.file_mime_type || null,
                timestamp: Date.now(),
                is_replied: data.is_replied || false,
                replied_to: (data.is_replied || false) ? 
                {
                    connect: {
                        id: data.replied_to_id
                    }
                } : undefined
            },
            select: {
                id: true,
                sender: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                },
                text_content: true,
                message_type: true,
                file_mime_type: true,
                file_stored_name: true,
                file_name: true,
                is_notification_message: true,
                is_replied: true,
                replied_to: {
                    select: {
                        id: true,
                    }
                },
                timestamp: true
            }
        });
        callback({
            "success": true,
            "data": new_message
        })
        // list of usernames
        const usernames_list = chat.users.map(user => user.username);
        // send to all users in the chat
        io.to(usernames_list).except(socket.user.username).emit("new_message_added", {
            "chat_id": chat_id,
            "data": new_message
        });
    })
}

module.exports = handler