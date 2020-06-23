export function test() {

}

export namespace ConciergeAPI {
    // Branded type, it's just a string underneath
    export type Uuid = string & { __is_uuid: true };

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

    export interface Message {
        operation: "MESSAGE",
        target: Target,
        origin: Origin | undefined,
        data: object
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
        origin: Origin | undefined,
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
        clients: Array<Origin>
    }

    export interface GroupList {
        operation: "GROUP_LIST",
        groups: Array<string>
    }

    export interface ClientList {
        operation: "CLIENT_LIST",
        clients: Array<Origin>
    }

    export interface Subs {
        operation: "SUBS",
        groups: Array<string>,
    }

    export type ClientJoin = {
        operation: "CLIENT_JOIN"
    } & Origin;

    export type ClientLeave = {
        operation: "CLIENT_LEAVE"
    } & Origin;

    export interface Error {
        operation: "ERROR",
        code: number,
        data: string
    }

    export type Payload = Identify | Message | Subscribe | Unsubscribe
        | Broadcast | CreateGroup | DeleteGroup | FetchGroupSubs
        | FetchGroupList | FetchSubs | Hello | GroupSubs | GroupList
        | ClientList | Subs | ClientJoin | ClientLeave | Error;
}