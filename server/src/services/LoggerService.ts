import {Socket} from "socket.io";

export class LoggerService {
    constructor(public socket: Socket) {}

    public log(...args: any[]): void {
        const array = ['Log message from server:'];
        array.push.apply(array, args);
        console.log.apply(console, args);

        this.socket.emit('log', array);
    }

    public warn(...args: any[]): void {
        const array = ['Warn message from server:'];
        array.push.apply(array, args);
        console.warn.apply(console, args);

        this.socket.emit('warn', array);
    }

    public error(...args: any[]): void {
        const array = ['Error message from server:'];
        array.push.apply(array, args);
        console.error.apply(console, args);

        this.socket.emit('error', array);
    }

    public debug(...args: any[]): void {
        const array = ['Debug message from server:'];
        array.push.apply(array, args);
        console.debug.apply(console, args);

        this.socket.emit('debug', array);
    }
}
