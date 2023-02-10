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
            res.redirect("/auth/login");
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
        if (!req.cookies.token || JWT.verify(req.cookies.token) == false) {
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

    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static redirectLoggedInUser(req, res, next) {
        if (req.is_authenticated) {
            res.redirect(`/${req.user.username}`);
        }else{
            next();
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static loginRequired(req, res, next) {
        if (req.is_authenticated) {
            next();
        }else{
            res.redirect("/auth/login");
        }
    }
}

module.exports = {AuthMiddleware};