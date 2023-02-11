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
    socket.on("fetch_messages", async ({chat_id}) => {
        const messages = await prisma.message.findMany({
            where: {
                chat: {
                    id: chat_id,
                    users: {
                        some: {
                            username: socket.user.username
                        }
                    }
                }
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
                        chat_id: true
                    }
                },
                timestamp: true
            }
        })
    })
}

module.exports = handler