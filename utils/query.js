const prisma = require("../db").getInstance();

class Query{
    /**
     * 
     * @param {String} username 
     * @returns {Promise<Array<String>>}
     */
    static async findAllConnectedUsers(username){
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
}

module.exports = Query