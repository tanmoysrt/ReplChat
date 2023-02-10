const router = require("express").Router();
const prisma = require("../db").getInstance();
const Password = require("../utils/password");
const JWT = require("../utils/jwt");

// login
router.post("/login", async (req, res) => {
    const username =  req.body.username;
    const password = req.body.password.toString();
    if(!username || !password) {
        return res.status(400).json({
            "success": false,
            "error": "Please fill in all fields"
        })
    }
    const user = await prisma.user.findFirst({
        where: {
            username: username
        },
        select: {
            id: true,
            name: true,
            username: true,
            hashedPassword: true,
        }
    })
    if(user == null){
        return res.status(404).json({
            "success": false,
            "error": "User not found"
        })
    }
    // Verify hash
    const passwordVerified = await Password.check(password, user.hashedPassword);
    if(!passwordVerified) {
        return res.status(200).json({
            "success": false,
            "error": "Incorrect password"
        })
    }
    // Create jwt
    const generatedToken = JWT.generate({
        id: user.id,
        name: user.name,
        username: user.username,
    })
    // Set cookie
    res.cookie("token", generatedToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    // Return success and jwt
    res.status(200).json({
        "success": true,
        "message": "Logged in successfully",
        "token": generatedToken
    })
})

// register
router.post("/register", async (req, res) => {
    const name = req.body.name;
    const username =  req.body.username;
    const password = req.body.password;
    if(!username || !password || !name) {
        return res.status(400).json({
            "success": false,
            "error": "Please fill in all fields"
        })
    }
    const user = await prisma.user.findFirst({
        where: {
            username: username
        },
        select: {
            id: true,
        }
    })
    if(user != null){
        return res.status(200).json({
            "success": false,
            "error": "User already exists"
        })
    }
    const generatedHash = await Password.make(password);
    const newUser = await prisma.user.create({
        data: {
            name: name,
            username: username,
            hashedPassword: generatedHash
        },
        select: {
            id: true,
            name: true,
            username: true,
        }
    })
    // Create jwt
    const generatedToken = JWT.generate({
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
    })
    // Send jwt token
    res.status(200).json({
        "success": true,
        "message": "User created",
        "token": generatedToken
    })
})


module.exports = router;