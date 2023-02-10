const router = require("express").Router();
const prisma = require("../db").getInstance();
const Password = require("../utils/password");
const JWT = require("../utils/jwt");

// login page
router.get("/login", async(req, res) => {
    res.render("login", {
        "isSuccess": false,
        "isError": false,
    });
})

// Handle login submission
router.post("/login", async (req, res) => {
    const username =  req.body.username;
    const password = req.body.password;
    if(!username || !password) {
        return res.render("login", {
            "isSuccess": false,
            "isError": true,
            "error": "Please fill in all fields"
        });
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
        return res.render("login", {
            "isSuccess": false,
            "isError": true,
            "error": "No user exists with this username"
        });
    }
    // Verify hash
    const passwordVerified = await Password.check(password, user.hashedPassword);
    if(!passwordVerified) {
        return res.render("login", {
            "isSuccess": false,
            "isError": true,
            "error": "Incorrect password"
        });
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
    // Redirect to home
    res.redirect("/");
})

// Handle logout
router.get("/logout", (req, res) => {

})


// Registration page
router.get("/register", (req, res) => {
    res.render("register", {
        "isSuccess": false,
        "isError": false,
    });
})

// Handle registration

router.post("/register", async (req, res) => {
    const name = req.body.username;
    const username =  req.body.username;
    const password = req.body.password;
    if(!username || !password || !name) {
        return res.render("register", {
            "isSuccess": false,
            "isError": true,
            "error": "Please fill in all fields"
        });
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
        return res.render("register", {
            "isSuccess": false,
            "isError": true,
            "error": "Username already exists"
        });
    }
    const generatedHash = await Password.make(password);
    const newUser = await prisma.user.create({
        data: {
            name: name,
            username: username,
            hashedPassword: generatedHash
        }
    })
    // TODO login and redirect to home
    res.render("register", {
        "isSuccess": true,
        "isError": false,
        "success": "Registration successful"
    });
})


module.exports = router;