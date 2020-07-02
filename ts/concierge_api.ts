// Branded type, it's just a string underneath
export type Uuid = string & { __is_uuid: true };

/**
 * Alias type for primitive types
 * @ignorenaming
 */
type Primitive = undefined | null | boolean | string | number | Function;
/**
 * Type modifier to make all the properties of an object Readonly
 */
export type Immutable<T> = T extends Primitive ? T : T extends Array<infer U> ? ReadonlyArray<U> : DeepImmutable<T>;
/**
 * Type modifier to make all the properties of an object Readonly recursively
 */
export type DeepImmutable<T> = T extends Primitive ? T : T extends Array<infer U> ? DeepImmutableArray<U> : DeepImmutableObject<T>;
/**
 * Type modifier to make object properties readonly.
 */
export type DeepImmutableObject<T> = {
    readonly [K in keyof T]: DeepImmutable<T[K]>;
};

interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> { }

function assertUuid(uuid: string): Uuid {
    return uuid as Uuid
}

export enum StatusCode {
    OK = 2000,
    MESSAGE_SENT = 2001,
    SUBSCRIBED = 2002,
    UNSUBSCRIBED = 2003,
    CREATED_GROUP = 2004,
    DELETED_GROUP = 2005,

    BAD = 4000,
    UNSUPPORTED = 4001,
    PROTOCOL = 4002,
    GROUP_ALREADY_CREATED = 4003,
    NO_SUCH_NAME = 4004,
    NO_SUCH_UUID = 4005,
    NO_SUCH_GROUP = 4006
}

export interface Origin {
    name: string,
    uuid: Uuid,
}

export interface TargetName {
    type: "NAME",
    name: string
}

export interface TargetUuid {
    type: "UUID",
    uuid: Uuid,
}

export interface TargetGroup {
    type: "GROUP",
    group: string
}

export type Target = TargetName | TargetUuid | TargetGroup;

export interface Identify {
    operation: "IDENTIFY",
    name: string,
}

export interface Message<T> {
    operation: "MESSAGE",
    target: Target,
    origin?: Origin,
    data: T
}

export interface Subscribe {
    operation: "SUBSCRIBE",
    group: string
}

export interface Unsubscribe {
    operation: "UNSUBSCRIBE",
    group: string
}

export interface Broadcast {
    operation: "BROADCAST",
    origin?: Origin,
    data: object
}

export interface CreateGroup {
    operation: "CREATE_GROUP",
    group: string
}

export interface DeleteGroup {
    operation: "DELETE_GROUP",
    group: string
}

export interface FetchGroupSubs {
    operation: "FETCH_GROUP_SUBS",
    group: string
}

export interface FetchGroupList {
    operation: "FETCH_GROUP_LIST"
}

export interface FetchClientList {
    operation: "FETCH_CLIENT_LIST"
}

export interface FetchSubs {
    operation: "FETCH_SUBS"
}

export interface Hello {
    operation: "HELLO",
    uuid: Uuid,
}

export interface GroupSubs {
    operation: "GROUP_SUBS",
    group: string,
    clients: Origin[]
}

export interface GroupList {
    operation: "GROUP_LIST",
    groups: string[]
}

export interface ClientList {
    operation: "CLIENT_LIST",
    clients: Origin[]
}

export interface Subs {
    operation: "SUBS",
    groups: string[],
}

export type ClientJoin = {
    operation: "CLIENT_JOIN"
} & Origin;

export type ClientLeave = {
    operation: "CLIENT_LEAVE"
} & Origin;

export interface Status<T> {
    operation: "STATUS",
    code: StatusCode,
    data: T
}

export type Payload<M> = Identify | Message<M> | Subscribe | Unsubscribe
    | Broadcast | CreateGroup | DeleteGroup | FetchGroupSubs
    | FetchGroupList | FetchSubs | Hello | GroupSubs | GroupList
    | ClientList | Subs | ClientJoin | ClientLeave | Status<any>;

export class ConciergeClient {
    readonly url: string;
    readonly name: string;
    reconnect: boolean;
    reconnectInterval: number = 5000;
    private socket!: WebSocket;
    private uuid!: Uuid;
    handlers: ConciergeRawHandler[] = [];

    constructor(name: string, url: string, reconnect: boolean = false) {
        this.url = url;
        this.name = name;
        this.reconnect = reconnect;
    }

    connect() {
        console.info("Trying to connect to ", this.url);
        this.socket = new WebSocket(this.url);
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }

    send(payload: Payload<any>) {
        this.socket.send(JSON.stringify(payload));
    }

    close(code?: number, reason?: string, reconnect: boolean = true) {
        this.socket.close(code, reason);
        if (reconnect && this.reconnect) {
            console.warn("Connection closed, reconnecting in", this.reconnectInterval, "ms")
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        }
    }

    private onOpen(event: Event) {
        for (let handler of this.handlers) {
            handler.onOpen?.(event);
        }
        this.send({
            operation: "IDENTIFY",
            name: this.name
        });
    }

    private onClose(event: CloseEvent) {
        for (let handler of this.handlers) {
            handler.onClose?.(event);
        }
        console.warn(event.code, event.reason);
    }

    private onReceive(event: MessageEvent) {
        let data = JSON.parse(event.data) as object;
        if (data.hasOwnProperty("operation")) {
            let payload = data as Payload<any>;
            for (let handler of this.handlers) {
                handler.onReceive?.(payload);
            }
        }
    }

    private onError(event: Event) {
        for (let handler of this.handlers) {
            handler.onError?.(event);
        }
        console.log(event);
    }
}

export interface ConciergeRawHandler {
    onOpen?(event: Event): void;
    onClose?(event: CloseEvent): void;
    onReceive?(payload: Payload<any>): void;
    onError?(event: Event): void;
}

export abstract class ConciergeEventHandler implements ConciergeRawHandler {
    onReceive(payload: Payload<any>): void {
        switch (payload.operation) {
            case "MESSAGE":
                this.onRecvMessage?.(payload);
                break;
            case "HELLO":
                this.onRecvHello?.(payload);
                break;
            case "GROUP_SUBS":
                this.onRecvGroupSubs?.(payload);
                break;
            case "GROUP_LIST":
                this.onRecvGroupList?.(payload);
                break;
            case "CLIENT_LIST":
                this.onRecvClientList?.(payload);
                break;
            case "SUBS":
                this.onRecvSubs?.(payload);
                break;
            case "CLIENT_JOIN":
                this.onRecvClientJoin?.(payload);
                break;
            case "CLIENT_LEAVE":
                this.onRecvClientLeave?.(payload);
                break;
            case "STATUS":
                this.onRecvStatus?.(payload);
                break;
        }
    }

    onRecvMessage?(message: Message<any>): void;
    onRecvHello?(hello: Hello): void;
    onRecvGroupSubs?(groupSubs: GroupSubs): void;
    onRecvGroupList?(groupList: GroupList): void;
    onRecvClientList?(clientList: ClientList): void;
    onRecvSubs?(subs: Subs): void;
    onRecvClientJoin?(clientJoin: ClientJoin): void;
    onRecvClientLeave?(clientLeave: ClientLeave): void;
    onRecvStatus?(status: Status<any>): void;
}