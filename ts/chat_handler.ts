import * as ConciergeAPI from "./concierge_api";
import { Renderer } from "./renderer";

const CHAT_GROUP = "chat";

export class ChatHandler extends ConciergeAPI.ServiceEventHandler {
    readonly renderer: Renderer;
    readonly client: ConciergeAPI.Client;

    constructor(renderer: Renderer, client: ConciergeAPI.Client) {
        super(client, CHAT_GROUP);
        this.renderer = renderer;
        this.client = client;
    }

    onRecvHello(hello: ConciergeAPI.Hello) {
        this.trySubscribe();
    }

    onSubscribe() {

    }

    onUnsubscribe() {
        
    }
}