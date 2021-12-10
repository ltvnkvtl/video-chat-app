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
            this.initLogger(socket);
            this.logger.log('New socket connection ' + socket.id);

            shareRoomsInfo(this.io, socket);

            socket.on(ACTIONS.MESSAGE, (message: string) => {
                this.logger.log('Client said: ', message);
                socket.broadcast.emit(ACTIONS.MESSAGE, message);
            });

            socket.on(ACTIONS.JOIN, (room: string) => {
                this.logger.log('Received request to create or join room ' + room);
                const joinedRooms = socket.rooms;

                if(Array.from(joinedRooms).includes(room)) {
                  return this.logger.warn(`Already joined to ${room}`);
                }

                const clientsInRoom = Array.from(this.io.sockets.adapter.rooms.get(room) || []);
                const numClients = clientsInRoom.length;
                this.logger.log('Room ' + room + ' now has ' + numClients + ' client(s)');

                // notify members about new one
                clientsInRoom.forEach(clientId => {
                  this.io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerID: socket.id,
                    createOffer: false,
                  })

                  socket.emit(ACTIONS.ADD_PEER, {
                    peerID: clientId,
                    createOffer: true,
                  })
                });

                socket.join(room);
                this.logger.log(`Client ID ${socket.id} ${(numClients === 0 ? 'created' : 'joined')} room: ${room}`);
                shareRoomsInfo(this.io, socket);
            });

            socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
              this.io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
                peerID: socket.id,
                sessionDescription,
              })
            })

          socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
            this.io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
              peerID: socket.id,
              iceCandidate,
            })
          })

            socket.on(ACTIONS.LEAVE, leaveRoom(this.io, socket));

            socket.on('disconnect', function (reason: string) {
                console.log(`Peer or server disconnected. Reason: ${reason}.`);
                socket.broadcast.emit('bye');
            });

            socket.on('bye', function (room: string) {
                console.log(`Peer said bye on room ${room}.`);
            });
        });
    }
}
