const JWT = require("./utils/jwt");
const prisma = require("./db").getInstance();

const {Request, Response, NextFunction} = require("express");
const SocketIO = require("socket.io");

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
        if (!req.headers.token || JWT.verify(req.headers.token) == false) {
            req.is_authenticated = false;
            req.user = null;
        }else{
            req.is_authenticated = true;
            const [_, content] = JWT.getContent(req.headers.token);
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

class SocketAuthMiddleware {
    /**
     * @param {SocketIO.Socket} socket
     * @param {NextFunction} next
     * @returns {Promise<void>}
     * @constructor
     * @static
     * @memberof SocketAuthMiddleware
     * @description This middleware will be called when a socket is connected
     */
    static async authAndResolveUser(socket, next){
        if (!socket.handshake.auth.token || JWT.verify(socket.handshake.auth.token) == false) {
            next(new Error("Unauthenticated user"));
            return;
        }else{
            const [_, content] = JWT.getContent(socket.handshake.auth.token);
            socket.user = await prisma.user.findFirst({
                where: {
                    username: content.username
                },
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            })
        }
        next();
    }
}

module.exports = {AuthMiddleware, SocketAuthMiddleware};