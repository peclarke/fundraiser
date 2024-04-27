import WebSocket from 'ws';
import {v4 as uuidv4} from 'uuid';
import { EventEval, EventType } from './types';

// SERVER STORE
let donations = 0.00;
let milestones: any[] = [
    {
        goal: 20,
        desc: "Something sweet!"
    },
    {
        goal: 30,
        desc: "A second prize unveils itself"
    },
    {
        goal: 50,
        desc: "You win a house"
    }
];


// Connection store
let adminClientId: string | null = null;
let userClients: Record<string, WebSocket> = {};

const wss = new WebSocket.Server({ port: 8000 });
console.log("Server started successfully")

const sendMessage = (message: any, id: string) => {
    if (!(Object.keys(userClients).includes(id))) {
        console.error("Client user ID does not exist")
        return;
    }

    const userWebSocket = userClients[id];
    userWebSocket.send(JSON.stringify(message));

    console.log("Message sent to client")
}

const handleMessage = (message: string, id: string) => {
    console.log("New message received")
    const data: EventEval = JSON.parse(message.toString());

    switch (data.type) {
        case EventType.ADMIN:
            console.log("User escalated to admin, ID: " + id);
            adminClientId = id;
            console.log("Hydrating data")
            sendMessage({
                type: "init",
                content: {
                    donations: donations,
                    milestones: milestones,
            }}, id)
            break;
        case EventType.UPDATE:
            donations  = data.content.donations;
            milestones = data.content.milestones;

            console.log("update time", data)
            wss.clients.forEach(client => {
                client.send(JSON.stringify(data))
            })
            break;
        case EventType.RELOAD:
            userClients[id].send(JSON.stringify({
                type: "reload",
                content: {
                    donations: donations,
                    milestones: milestones
                }
            }))
            break;
        default:
            console.error("Error: unknown event type " + data);
            break;
    }
}

wss.on('connection', (ws: WebSocket) => {
    // unique identifier for the user
    const id = uuidv4();
    userClients[id] = ws;
    console.log('New client: ['+id+'] connected');

    // ws.send(JSON.stringify({
    //     type: "init",
    //     content: {
    //         donations: donations,
    //         milestones: milestones,
    //     }
    // } as EventEval))
    // console.log("Inital message sent")

    ws.on('message', (message: string) => handleMessage(message, id));

    ws.on('close', () => {
        // remove the client, whatever type it is
        if (adminClientId && adminClientId === id) {
            adminClientId = null;
        }
        delete userClients[id];
        console.log("User disconnected");
    });
});