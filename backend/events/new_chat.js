const prisma = require("../db").getInstance();
const SocketIO = require("socket.io");

/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * 
 **/
function handler(io, socket){
    socket.on("new_chat", async({username}, callback) => {
        const receiver_user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if(!receiver_user){
            return callback({
                success: false,
                error: "User not found"
            })
        }
        const chat_record = await prisma.chatRecord.create({
            data: {
                is_group_chat: false,
                users: {
                    connect: [
                        {
                            username: socket.user.username
                        },
                        {
                            username: username
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
            success: true
        })
        // send notification regarding new_chat with new_chat_added event
        // for current user
        let payload_for_current_user = JSON.parse(JSON.stringify(chat_record));
        payload_for_current_user = {
            ...payload_for_current_user,
            users: payload_for_current_user.users.filter(user => user.username != socket.user.username)
        }
        io.to(socket.user.username).emit("new_chat_added", payload_for_current_user);

        // for other end user
        let payload_for_receiver_user = JSON.parse(JSON.stringify(chat_record));
        payload_for_receiver_user = {
            ...payload_for_receiver_user,
            users: payload_for_receiver_user.users.filter(user => user.username != username)
        }
        io.to(username).emit("new_chat_added", payload_for_receiver_user);
    })
}

module.exports = handler