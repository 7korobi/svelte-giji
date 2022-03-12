import type { Socket } from 'socket.io';
export declare function fcm(socket: Socket, token: string, appends: string[], deletes: string[], done: (topics: boolean) => void): Promise<void>;
