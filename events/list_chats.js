const redis_client = require("../redis").getInstance();
const moment = require("moment");
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
        // get last message
        for (let i = 0; i < chat_records.length; i++) {
            let last_message = await prisma.message.findFirst({
                where: {
                    chat_id: chat_records[i].id
                },
                orderBy: {
                    timestamp: "desc"
                },
                select: {
                    message_type: true,
                    text_content: true,
                    timestamp: true,
                }
            })
            if (last_message) {
                chat_records[i].last_message = {
                    message_type: last_message.message_type,
                    text_content: last_message.text_content,
                    created_at: moment(parseInt(last_message.timestamp)).fromNow()
                }
            }else{
                chat_records[i].last_message = {
                    message_type: "TEXT",
                    text_content: "No messages yet",
                    created_at: ""
                }
            }
        }
        callback({
            success: true,
            data: chat_records
        })
    })
}

module.exports = handler