const JWT = require("./utils/jwt");
const prisma = require("./db").getInstance();

const {Request, Response, NextFunction} = require("express");

class AuthMiddleware {
    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static authRequired(req, res, next) {
        if (req.is_authenticated == false) {
            res.status(401).json({error: "Unauthorized"});
        }else{
            next();
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static async resolveUser(req, res, next) {
        if (!req.headers.authorization || JWT.verify(req.headers.authorization) == false) {
            req.is_authenticated = false;
            req.user = null;
        }else{
            req.is_authenticated = true;
            const [_, content] = JWT.getContent(req.headers.authorization);
            req.user = await prisma.user.findFirst({
                where: {
                    username: content.username
                },
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            })
            if(req.user == null) req.is_authenticated = false;
        }
        next();
    }
}

module.exports = {AuthMiddleware};