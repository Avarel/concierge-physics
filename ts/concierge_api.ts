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
    group?: string,
}

export interface BaseTarget<T extends string> {
    type: T
}
export interface TargetName extends BaseTarget<"NAME"> {
    name: string
}
export interface TargetUuid extends BaseTarget<"UUID"> {
    uuid: Uuid,
}
export interface TargetGroup extends BaseTarget<"GROUP"> {
    group: string
}
export interface TargetAll extends BaseTarget<"ALL"> { }

export type Target = TargetName | TargetUuid | TargetGroup | TargetAll;

export interface BasePayload<T extends string> {
    type: T
}

export interface Identify extends BasePayload<"IDENTIFY"> {
    name: string,
    version: string,
    secret?: string
}
export interface Message<T> extends BasePayload<"MESSAGE"> {
    target: Target,
    origin?: Origin,
    data: T
}
export interface Subscribe extends BasePayload<"SUBSCRIBE"> {
    group: string
}
export interface Unsubscribe extends BasePayload<"UNSUBSCRIBE"> {
    group: string
}
export interface CreateGroup extends BasePayload<"CREATE_GROUP"> {
    group: string
}
export interface DeleteGroup extends BasePayload<"DELETE_GROUP"> {
    group: string
}
export interface FetchGroupSubs extends BasePayload<"FETCH_GROUP_SUB_LIST"> {
    group: string
}
export interface FetchGroupList extends BasePayload<"FETCH_GROUP_LIST"> { }
export interface FetchClientList extends BasePayload<"FETCH_CLIENT_LIST"> { }
export interface FetchSubList extends BasePayload<"FETCH_SUB_LIST"> { }
export interface Hello extends BasePayload<"HELLO"> {
    uuid: Uuid,
    version: string
}
export interface GroupSubs extends BasePayload<"GROUP_SUB_LIST"> {
    group: string,
    clients: Origin[]
}
export interface GroupList extends BasePayload<"GROUP_LIST"> {
    groups: string[]
}
export interface ClientList extends BasePayload<"CLIENT_LIST"> {
    clients: Origin[]
}
export interface SubList extends BasePayload<"SUB_LIST"> {
    groups: string[],
}
export interface ClientJoin extends BasePayload<"CLIENT_JOIN">, Origin { }
export interface ClientLeave extends BasePayload<"CLIENT_LEAVE">, Origin { }
export interface Status<T> extends BasePayload<"STATUS"> {
    code: StatusCode,
    data: T
}

export type Payload<M> = Identify | Message<M> | Subscribe | Unsubscribe
    | CreateGroup | DeleteGroup | FetchGroupSubs
    | FetchGroupList | FetchSubList | Hello | GroupSubs | GroupList
    | ClientList | SubList | ClientJoin | ClientLeave | Status<any>;

/**
 * Central connector to the concierge.
 */
export class Client {
    readonly url: string;
    readonly name: string;

    private socket?: WebSocket;
    private version?: string;
    private secret?: string;

    reconnect: boolean;
    reconnectInterval: number = 10000;
    uuid!: Uuid;
    handlers: RawHandler[] = [];

    constructor(name: string, url: string, reconnect: boolean = false) {
        this.url = url;
        this.name = name;
        this.reconnect = reconnect;
    }

    connect(version: string, secret?: string) {
        console.info("Trying to connect to ", this.url);
        this.version = version;
        this.secret = secret;
        this.socket = new WebSocket(this.url);
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }

    sendJSON(payload: Payload<any>) {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.send(JSON.stringify(payload));
    }

    close(code?: number, reason?: string, reconnect: boolean = true) {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.close(code, reason);
        if (reconnect) {
            this.tryReconnect();
        } else {
            this.socket = undefined;
            this.version = undefined;
            this.secret = undefined;
        }
    }

    private tryReconnect() {
        if (this.reconnect) {
            console.warn("Connection closed, reconnecting in", this.reconnectInterval, "ms")
            setTimeout(() => {
                this.connect(this.version!, this.secret);
            }, this.reconnectInterval);
        }
    }

    private onOpen(event: Event) {
        for (let handler of this.handlers) {
            handler.onOpen?.(event);
        }
        if (this.version == undefined) {
            throw new Error("Version is undefined")
        }
        console.log("Identifying with version", this.version);
        this.sendJSON({
            type: "IDENTIFY",
            name: this.name,
            version: this.version,
            secret: this.secret
        });
    }

    private onClose(event: CloseEvent) {
        for (let handler of this.handlers) {
            handler.onClose?.(event);
        }
        console.warn(event.code, event.reason);
        this.tryReconnect();
    }

    private onReceive(event: MessageEvent) {
        let data = JSON.parse(event.data) as object;
        if (data.hasOwnProperty("type")) {
            let payload = data as Payload<any>;

            if (payload.type == "HELLO") {
                this.uuid = payload.uuid;
            }

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

/**
 * Low level handler for the concierge client. Events from JS sockets are passed
 * directly to this handler.
 */
export interface RawHandler {
    onOpen?(event: Event): void;
    onClose?(event: CloseEvent): void;
    onReceive?(payload: Payload<any>): void;
    onError?(event: Event): void;
}

/**
 * Class that allows for high level interaction with incoming payloads.
 */
export abstract class EventHandler implements RawHandler {
    onReceive(payload: Payload<any>): void {
        switch (payload.type) {
            case "MESSAGE":
                this.onRecvMessage?.(payload);
                break;
            case "HELLO":
                this.onRecvHello?.(payload);
                break;
            case "GROUP_SUB_LIST":
                this.onRecvGroupSubs?.(payload);
                break;
            case "GROUP_LIST":
                this.onRecvGroupList?.(payload);
                break;
            case "CLIENT_LIST":
                this.onRecvClientList?.(payload);
                break;
            case "SUB_LIST":
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
    onRecvSubs?(subs: SubList): void;
    onRecvClientJoin?(clientJoin: ClientJoin): void;
    onRecvClientLeave?(clientLeave: ClientLeave): void;
    onRecvStatus?(status: Status<any>): void;
}

/**
 * Utility class that automatically handles subscription to a specific group.
 */
export abstract class ServiceEventHandler extends EventHandler {
    readonly client: Client;
    protected subscribeInterval: number = 5000;
    protected subscribeHandle: number | undefined;
    protected group: string;

    constructor(client: Client, group: string) {
        super();
        this.client = client;
        this.group = group;
    }

    /**
     * Try to regularly subscribe to a group until it succeeds.
     */
    trySubscribe() {
        // try to subscribe until good ("STATUS" handle)
        let subFn = () => {
            console.log("Attempting to subscribe to ", this.group);
            this.client.sendJSON({
                type: "SUBSCRIBE",
                group: this.group
            });
        };

        subFn();
        this.subscribeHandle = window.setInterval(subFn, this.subscribeInterval);
    }

    /**
     * Called when the handler successfully subscribes to the group.
     */
    abstract onSubscribe(): void;

    /**
     * Called when the handler is unsubscribed from the group.
     */
    abstract onUnsubscribe(): void;

    /**
     * Cancels the process that tries to continuously subscribes to a group.
     * This cancellation happens automatically when the handler successfully
     * subscribes.
     */
    cancelSubscribe() {
        clearInterval(this.subscribeHandle)
        this.subscribeHandle = undefined;
    }

    onRecvStatus(status: Status<any>): void {
        switch (status.code) {
            case StatusCode.NO_SUCH_GROUP:
                if (status.data == this.group) {
                    console.error("Group `", this.group, "`does not exist on concierge, is the simulation server on?")
                }
                break;
            case StatusCode.SUBSCRIBED:
                // subscription complete, stop trying to join
                if (status.data == this.group) {
                    this.cancelSubscribe();
                    this.onSubscribe();
                }
                break;
            case StatusCode.UNSUBSCRIBED:
                if (status.data == this.group) {
                    this.trySubscribe();
                    this.onUnsubscribe();
                }
                break;
        }
    }
}