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
    socket.on("add_member_group_chat", async ({chat_id, username}, callback) => {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if(!user){
            return callback({
                success: false,
                error: "User not found"
            })
        }
        const chat_record = await prisma.chatRecord.findFirst({
            where: {
                id: chat_id,
                is_group_chat: true,
                users: {
                    some: {
                        id: socket.user.id
                    }
                }
            },
            select: {
                id: true,
                name: true,
                is_group_chat: true,
                users: {
                    select: {
                        username: true
                    }
                }
            }
        })
        if(!chat_record){
            return callback({
                success: false,
                error: "Chat not found"
            })
        }
        if(!chat_record.is_group_chat){
            return callback({
                success: false,
                error: "Chat is not a group chat"
            })
        }
        await prisma.chatRecord.update({
            where: {
                id: chat_id
            },
            data: {
                users: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
        callback({
            success: true,
            message: "Member added successfully"
        })
        // create notification message
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
                is_notification_message: true,
                message_type: "TEXT",
                text_content: `${socket.user.username} added ${username} to the group chat`,
                timestamp: Date.now()
            },
            select: {
                id: true,
                sender: {
                    select: {
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
        // send notification regarding new_chat with new_chat_added event
        let usernames_list = chat_record.users.map(user => user.username);
        io.to(usernames_list).emit("new_member_added", {
            "chat_id": chat_id,
            "user": {
                id: user.id,
                username: user.username,
                name: user.name
            }
        });
        io.to(usernames_list).emit("new_message_added", {
            "chat_id": chat_id,
            "data": new_message
        });
        // you_are_added_to_group event
        const chatRecordUpdated = await prisma.chatRecord.findFirst({
            where: {
                id: chat_id
            },
            select: {
                id: true,
                is_group_chat: true,
                name: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                }
            }
        })
        io.to(username).emit("new_chat_added", {
            ...chatRecordUpdated,
            users: chatRecordUpdated.users.filter(user => user.username != socket.user.username),
            last_message: {
                message_type: "TEXT",
                text_content: "No messages yet",
                created_at: ""
            }  
        });
    })
}

module.exports = handler