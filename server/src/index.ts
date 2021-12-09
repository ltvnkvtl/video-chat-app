import { Server } from "./server";
import {ServerOptions} from "socket.io";

// const socketConfig: Partial<ServerOptions> = {
//   "force new connection": true,
//   reconnectionAttempts: "Infinity",
//   timeout: 10000,
//   transports: ["websocket"]
//
// }

const server = new Server();

server.listen(port => {
  console.log(`Server is listening on http://localhost:${port}`);
});
