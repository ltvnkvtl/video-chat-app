import mongoose from 'mongoose';
import { config } from 'dotenv';
import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import {Server as SocketIOServer, ServerOptions} from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { serve, setup } from 'swagger-ui-express';

import * as swaggerDocument from './swagger.json';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import { errorMiddleware } from './middleware/error-middleware';
import * as os from "os";
import {NetworkInterfaceInfo} from "os";
import {LoggerService} from "./services/LoggerService";


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
        this.httpServer.listen(this.DEFAULT_PORT, () =>
          callback(Number(this.DEFAULT_PORT))
        );
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
      transports: ["websocket"],
    });

    this.io.sockets.on('connection', (socket: any) => {
      this.initLogger(socket);

      socket.on('message', (message: string) => {
        this.logger.log('Client said: ', message);
        socket.broadcast.emit('message', message);
      });

      socket.on('create or join', (room: string) => {

        this.logger.log('Received request to create or join room ' + room);

        const clientsInRoom = this.io.sockets.adapter.rooms.get(room);
        const numClients = clientsInRoom ? clientsInRoom.size : 0; // : TODO Object.keys(clientsInRoom.sockets).length
        this.logger.log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 0) {
          socket.join(room);
          this.logger.log('Client ID ' + socket.id + ' created room ' + room);
          socket.emit('created', room, socket.id);
        } else if (numClients === 1) {
          this.logger.log('Client ID ' + socket.id + ' joined room ' + room);
          // io.sockets.in(room).emit('join', room);
          socket.join(room);
          socket.emit('joined', room, socket.id);
          this.io.sockets.in(room).emit('ready', room);
          socket.broadcast.emit('ready', room);
        } else { // : TODO max two clients, add more!!!
          socket.emit('full', room);
        }
      });

      socket.on('ipaddr', () => {
        const networkInfo = os.networkInterfaces();
        for (const dev in networkInfo) {
          networkInfo![dev]!.forEach((details: NetworkInterfaceInfo) => {
            this.logger.warn(details)
            if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
              this.logger.debug(details)
              socket.emit('ipaddr', details.address);
            }
          });
        }
      });

      socket.on('disconnect', function (reason: string) {
        console.log(`Peer or server disconnected. Reason: ${reason}.`);
        socket.broadcast.emit('bye');
      });

      socket.on('bye', function (room: string | number) {
        console.log(`Peer said bye on room ${room}.`);
      });
    });
  };
}
