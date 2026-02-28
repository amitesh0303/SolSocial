import { WebSocketServer } from "ws";
export type WsChannel = {
    type: "feed";
    wallet: string;
} | {
    type: "post";
    address: string;
} | {
    type: "profile";
    wallet: string;
} | {
    type: "community";
    id: string;
};
export declare function createWsServer(port: number): WebSocketServer;
