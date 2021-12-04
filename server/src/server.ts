import mongoose from 'mongoose';
import { config } from 'dotenv';
import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { serve, setup } from 'swagger-ui-express';

import * as swaggerDocument from './swagger.json';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import { errorMiddleware } from './middleware/error-middleware';


export class Server {
  private httpServer!: HTTPServer;
  private app!: Application;
  private io!: SocketIOServer;

  private readonly DEFAULT_PORT = process.env.PORT || 3030;

  constructor() {
    this.initialize();
    this.initMiddleware();
    this.defineRoutes();
  }

  private initialize(): void {
    config(); // .env
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);
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
}
