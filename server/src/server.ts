import mongoose from 'mongoose';
import { config } from 'dotenv';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer, ServerOptions, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { serve, setup } from 'swagger-ui-express';

import * as swaggerDocument from './swagger.json';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import { errorMiddleware } from './middleware/error-middleware';
import * as os from 'os';
import { NetworkInterfaceInfo } from 'os';
import { LoggerService } from './services/LoggerService';
import {leaveRoom, shareRoomsInfo} from "./helper-functions/socket-helpers";
import {ACTIONS} from "./models/socket-actions";

export class Server {
    private httpServer!: HTTPServer;
    private app!: Application;
    private io!: SocketIOServer;
    private logger!: LoggerService;

    private activeSockets: string[] = [];

    private readonly DEFAULT_PORT = process.env.PORT || 3030;

    constructor(socketConfig?: Partial<ServerOptions>) {
        this.initializeHttpServer();
        this.initMiddleware();
        this.defineRoutes();
        this.initSocketConnection(socketConfig);
    }

    public listen(callback: (port: number) => void): void {
        try {
            mongoose.connect(`${process.env.DB_URL}`, err => {
                if (err) return console.log(err);
                this.httpServer.listen(this.DEFAULT_PORT, () => callback(Number(this.DEFAULT_PORT)));
            });
        } catch (e) {
            console.log(e);
        }
    }

    private initializeHttpServer(): void {
        config(); // .env
        this.app = express();
        this.httpServer = createServer(this.app);
    }

    private defineRoutes(): void {
        this.app.use('/api-docs', serve, setup(swaggerDocument));
        this.app.use('/api', userRouter);
        this.app.use('/api/auth', authRouter);
        this.app.use(errorMiddleware);
    }

    private initMiddleware(): void {
        this.app.use(
            express.urlencoded({
                extended: true,
            }),
        );
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private initLogger(socket: any): void {
        this.logger = new LoggerService(socket);
    }

    private initSocketConnection(config?: Partial<ServerOptions>) {
        this.io = new SocketIOServer(this.httpServer, {
            connectTimeout: 10000,
            transports: ['websocket'],
            cors: {
              origin: "http://localhost:4200",
              credentials: true
            }
        });

        this.io.sockets.on('connection', (socket: Socket) => {
          const existingSocket = this.activeSockets.find(
            existingSocket => existingSocket === socket.id
          );

          if (!existingSocket) {
            this.activeSockets.push(socket.id);

            socket.emit("update-user-list", {
              users: this.activeSockets.filter(
                existingSocket => existingSocket !== socket.id
              )
            });

            socket.broadcast.emit("update-user-list", {
              users: [socket.id]
            });
          }

          socket.on("call-user", (data: any) => {
            socket.to(data.to).emit("call-made", {
              offer: data.offer,
              socket: socket.id
            });
          });

          socket.on("make-answer", data => {
            socket.to(data.to).emit("answer-made", {
              socket: socket.id,
              answer: data.answer
            });
          });

          socket.on("reject-call", data => {
            socket.to(data.from).emit("call-rejected", {
              socket: socket.id
            });
          });

          socket.on("disconnect", () => {
            this.activeSockets = this.activeSockets.filter(
              existingSocket => existingSocket !== socket.id
            );
            socket.broadcast.emit("remove-user", {
              socketId: socket.id
            });
          });
        });
    }
}
