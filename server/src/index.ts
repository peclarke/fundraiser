import WebSocket from 'ws';
import {v4 as uuidv4} from 'uuid';
import { EventEval, EventType, UserClient } from './types';

let donations = 0;
let milestones = [];

let adminClientId: string | null = null;
let userClients: UserClient[] = [];

const wss = new WebSocket.Server({ port: 8000 });
console.log("Server started successfully")


const handleMessage = (message: string, id: string) => {
    console.log("New message received")
    const data: EventEval = JSON.parse(message.toString());

    switch (data.type) {
        case EventType.ADMIN:
            console.log("User escalated to admin, ID: " + id);
            adminClientId = id;
            break;
        case EventType.UPDATE:
            donations  = data.content.donations;
            milestones = data.content.milestones;

            console.log("update time", data)
            wss.clients.forEach(client => {
                client.send(JSON.stringify(data))
            })
            break;
        default:
            console.error("Error: unknown event type " + data);
            break;
    }
}

wss.on('connection', (ws: WebSocket) => {
    const id = uuidv4();

    console.log('New client connected');

    ws.on('message', (message: string) => handleMessage(message, id));

    ws.on('close', () => {
        // remove the client, whatever type it is
        if (adminClientId && adminClientId === id) {
            adminClientId = null;
        }
        const newUsers = userClients.filter(el => el.id !== id);
        userClients = newUsers;
        console.log("User disconnected");
    });
});