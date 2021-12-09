// convenience function to log server messages on the client
export function socketLogger(socket: any) {
    return function log(...args: any[]): void {
        var array = ['Message from server:'];
        array.push.apply(array, args);
        console.log.apply(console, args);
        socket.emit('log', array);
    };
}
