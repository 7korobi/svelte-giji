import { Server } from "socket.io"

const port = 3001

const io = new Server({
});

io.on("connection", (socket) => {
	socket.emit("hello", 1, new Date, "World", /a*b/i)
});

console.log(`  local:   ws://localhost:${port}`)
io.listen(port)
