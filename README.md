This project is licensed under MIT License
# ReplChat


Sample route for access file 
http://127.0.0.1:3000/file/access?name=Sameple%20nice.png&key=d33c7565b73b6c3ed33bec3d34a67c4b&type=image/png

Sample events
```javascript
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

}

module.exports = handler
```