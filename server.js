// ================================================================================================================================================================================
require('dotenv').config();

const PORT = parseInt(process.env.PORT);
const DEBUG = parseInt(process.env.DEBUG);

// JSON bigint override
const json_big = require('json-bigint');
JSON.parse = json_big.parse;
JSON.stringify = json_big.stringify;

// Setup
const express = require('express');
const SocketIO = require('socket.io');
const app = express();
const http_server = require("http").createServer(app);
const io = new SocketIO.Server(http_server);

// Config
global.__basedir = __dirname;
app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set logger
if (DEBUG == 1) {
    var morgan = require('morgan');
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}


// ================================================================================================================================================================================

// ? REST API
app.use(require("./middleware").AuthMiddleware.resolveUser);
app.use("/auth", require("./routes/auth.route"));
app.use("/file", require("./routes/file"));
// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Unexpected Error" });
})

// ? Socket.io routes
io.use(require("./middleware").SocketAuthMiddleware.authAndResolveUser);
io.on("connection", (socket) => {
    require("./events/connect")(io, socket);
    require("./events/disconnect")(io, socket);
    require("./events/ping")(io, socket);
    require("./events/fetch_status")(io, socket);
    require("./events/new_chat")(io, socket);
    require("./events/new_message")(io, socket);
    require("./events/list_chats")(io, socket);
    require("./events/fetch_messages")(io, socket);
    require("./events/typing")(io, socket);
})

// Listen
http_server.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
