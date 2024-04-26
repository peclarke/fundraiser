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
    INIT    = "init",
    RELOAD  = "reload",
}

export type EventEval = {
    type: EventType.UPDATE | EventType.INIT;
    content: { milestones: [], donations: number };
} | {
    type: EventType.ADMIN | EventType.RELOAD;
    content: any;
}