const http = require("http");
const express = require("express");
let app = express();



const hostName = "127.0.0.1"
const port = 3000;

const server = http.Server(app);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"))

server.listen(port, hostName, () => {
    console.log(`server running at http://${hostName}:${port}/`);
});

var io = require("socket.io")(server, {});
io.sockets.on("connection", function(socket) {
    console.log("Socket connection");
})