// Branded type, it's just a string underneath
export type Uuid = string & { __is_uuid: true };

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