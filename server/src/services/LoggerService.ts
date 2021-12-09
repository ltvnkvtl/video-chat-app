export class LoggerService {
    constructor(public socket: any) {}

    public log(...args: any[]): void {
        var array = ['Message from server:'];
        array.push.apply(array, args);
        console.log.apply(console, args);

        this.socket.emit('log', array);
    }

    public warn(...args: any[]): void {
        var array = ['Message from server:'];
        array.push.apply(array, args);
        console.warn.apply(console, args);

        this.socket.emit('warn', array);
    }

    public error(...args: any[]): void {
        var array = ['Message from server:'];
        array.push.apply(array, args);
        console.error.apply(console, args);

        this.socket.emit('error', array);
    }

    public debug(...args: any[]): void {
        var array = ['Message from server:'];
        array.push.apply(array, args);
        console.debug.apply(console, args);

        this.socket.emit('debug', array);
    }
}
