const prisma = require("../db").getInstance();

class Query {
    /**
     * 
     * @param {String} username 
     * @returns {Promise<Array<String>>}
     */
    static async findAllConnectedUsersUsernames(username) {
        const users = await prisma.user.findMany({
            where: {
                chat_records: {
                    some: {
                        users: {
                            some: {
                                username: username
                            }
                        }
                    }
                }
            },
            select: {
                username: true,
            }
        })
        return users.map(user => user.username);
    }

    /**
     * 
     * @param {String} username 
     * @param {String} chat_id
     * @returns {Promise<Array<String>>}
     */
    static async findAllConnectedUsersUsernames(username, chat_id) {
        const users = await prisma.user.findMany({
            where: {
                chat_records: {
                    some: {
                        id: chat_id,
                        users: {
                            some: {
                                username: username
                            }
                        }
                    }
                }
            },
            select: {
                username: true,
            }
        })
        return users.map(user => user.username);
    }
}

module.exports = Query