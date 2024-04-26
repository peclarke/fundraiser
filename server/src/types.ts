// --------- CLIENTS -----------

type Client = {
    id: string;
}

export type UserClient = Client & {

}

// -------- EVENTS -----------

export enum EventType {
    ADMIN   = "admin", // event requesting admin access
    UPDATE  = "update",
}

export type EventEval = {
    type: EventType.UPDATE;
    content: { milestones: [], donations: number };
} | {
    type: EventType.ADMIN;
    content: any;
}