import { io, Socket } from 'socket.io-client';

export class SocketClient {
    private socket: Socket;

    constructor(private readonly baseUrl: string) {
        this.socket = io(this.baseUrl, {
            transports: ['websocket'],
            withCredentials: true,
        });
    }

    connect() {
        this.socket.on('connect', () => {
            console.log(`Socket :: Client connected with ID: ${this.socket.id}`);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket :: Client disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error(`Socket :: Connection error: ${err.message}`, err.stack);
            setTimeout(() => {
                console.log('Socket :: Client reconnecting');
                this.socket.connect();
            }, 1000);
        });
    }
}
