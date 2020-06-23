export declare function test(): void;
export declare namespace ConciergeAPI {
    type Uuid = string & {
        __is_uuid: true;
    };
    interface Origin {
        name: string;
        uuid: Uuid;
    }
    interface TargetName {
        type: "NAME";
        name: string;
    }
    interface TargetUuid {
        type: "UUID";
        uuid: Uuid;
    }
    interface TargetGroup {
        type: "GROUP";
        group: string;
    }
    type Target = TargetName | TargetUuid | TargetGroup;
    interface Identify {
        operation: "IDENTIFY";
        name: string;
    }
    interface Message {
        operation: "MESSAGE";
        target: Target;
        origin: Origin | undefined;
        data: object;
    }
    interface Subscribe {
        operation: "SUBSCRIBE";
        group: string;
    }
    interface Unsubscribe {
        operation: "UNSUBSCRIBE";
        group: string;
    }
    interface Broadcast {
        operation: "BROADCAST";
        origin: Origin | undefined;
        data: object;
    }
    interface CreateGroup {
        operation: "CREATE_GROUP";
        group: string;
    }
    interface DeleteGroup {
        operation: "DELETE_GROUP";
        group: string;
    }
    interface FetchGroupSubs {
        operation: "FETCH_GROUP_SUBS";
        group: string;
    }
    interface FetchGroupList {
        operation: "FETCH_GROUP_LIST";
    }
    interface FetchClientList {
        operation: "FETCH_CLIENT_LIST";
    }
    interface FetchSubs {
        operation: "FETCH_SUBS";
    }
    interface Hello {
        operation: "HELLO";
        uuid: Uuid;
    }
    interface GroupSubs {
        operation: "GROUP_SUBS";
        group: string;
        clients: Array<Origin>;
    }
    interface GroupList {
        operation: "GROUP_LIST";
        groups: Array<string>;
    }
    interface ClientList {
        operation: "CLIENT_LIST";
        clients: Array<Origin>;
    }
    interface Subs {
        operation: "SUBS";
        groups: Array<string>;
    }
    type ClientJoin = {
        operation: "CLIENT_JOIN";
    } & Origin;
    type ClientLeave = {
        operation: "CLIENT_LEAVE";
    } & Origin;
    interface Error {
        operation: "ERROR";
        code: number;
        data: string;
    }
    type Payload = Identify | Message | Subscribe | Unsubscribe | Broadcast | CreateGroup | DeleteGroup | FetchGroupSubs | FetchGroupList | FetchSubs | Hello | GroupSubs | GroupList | ClientList | Subs | ClientJoin | ClientLeave | Error;
}
