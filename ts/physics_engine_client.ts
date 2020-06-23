import * as ConciergeAPI from "./concierge";
import { DeepImmutable, Vector2, DeepImmutableArray } from "babylonjs";
import { renderer } from ".";
import { Shape } from "./renderer";

export interface Vec2f {
    x: number,
    y: number
}

export interface Entity {
    id: string,
    centroid: Vec2f,
    points: Vec2f[]
}

export interface EntityUpdate {
    id: string,
    position: Vec2f,
}

export interface FetchEntities {
    type: "FETCH_ENTITIES"
}

export interface FetchPosition {
    type: "FETCH_POSITION"
}

export interface EntityDump {
    type: "ENTITY_DUMP",
    entities: Entity[]
}

export interface PositionDump {
    type: "POSITION_DUMP"
    updates: EntityUpdate[]
}

type PhysicsPayload = EntityDump | PositionDump | FetchEntities | FetchPosition;

const PHYSICS_ENGINE_NAME = "physics_engine";
const PHYSICS_ENGINE_GROUP = "physics_engine_out";

type ConciergePayload = ConciergeAPI.Payload<PhysicsPayload>;

function vec2f2vector2(vec: Vec2f): Vector2 {
    return new Vector2(vec.x, vec.y);
}

class PhysicsSimulationClient {
    readonly name: string;
    readonly socket: WebSocket;
    uuid!: ConciergeAPI.Uuid;
    subscribeInterval: number | undefined;

    constructor(name: string) {
        this.name = name;
        this.socket = new WebSocket("ws://127.0.0.1/ws");
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => console.log(event);
        this.socket.onclose = event => this.onClose(event);
    }

    send(payload: DeepImmutable<ConciergePayload>) {
        this.socket.send(JSON.stringify(payload));
    }

    close(code?: number, reason?: string) {
        this.socket.close(code, reason);
    }

    private onOpen(event: Event) {
        this.send({
            operation: "IDENTIFY",
            name: this.name
        });
    }

    private onClose(event: CloseEvent) {
        console.log(event.code, event.reason);
        clearInterval(this.subscribeInterval);
    }

    private onReceive(event: MessageEvent) {
        let payload = JSON.parse(event.data) as ConciergeAPI.Payload<PhysicsPayload>;
        console.log(payload);
        this.processConciergePayload(payload);
    }

    private trySubscribe() {
        // try to subscribe until good ("STATUS" handle)
        // @ts-ignore
        this.subscribeInterval = setInterval(() => {
            this.send({
                operation: "SUBSCRIBE",
                group: PHYSICS_ENGINE_GROUP
            });
        }, 5000);
    }

    private cancelSubscribe() {
        clearInterval(this.subscribeInterval)
        this.subscribeInterval = undefined;
    }

    private onSubscribe() {
        this.send({
            operation: "MESSAGE",
            target: {
                type: "NAME",
                name: PHYSICS_ENGINE_NAME
            },
            data: {
                type: "FETCH_ENTITIES"
            }
        });
    }

    private processConciergePayload(payload: DeepImmutable<ConciergePayload>) {
        switch (payload.operation) {
            case "HELLO":
                this.uuid = payload.uuid;
                this.trySubscribe();
                break;
            case "MESSAGE":
                if (payload.origin!.name != PHYSICS_ENGINE_GROUP) {
                    return;
                }
                this.processPhysicsPayload(payload.data as PhysicsPayload);
                break;
            case "STATUS":
                switch (payload.code) {
                    case ConciergeAPI.StatusCode.SUBSCRIBED:
                        // subscription complete, stop trying to join
                        if (payload.data == PHYSICS_ENGINE_GROUP) {
                            this.cancelSubscribe();
                            this.onSubscribe();
                        }
                        break;
                    case ConciergeAPI.StatusCode.UNSUBSCRIBED:
                        if (payload.data == PHYSICS_ENGINE_GROUP) {
                            this.trySubscribe();
                        }
                        break;
                }
                break;
        }
    }

    private createShape(id: string, centroid: Vec2f, points: DeepImmutableArray<Vec2f>, scale: number = 1) {
        let centroidv = vec2f2vector2(centroid);
        let pointsv = points.map(vec2f2vector2);
        renderer.createPolygon(id, centroidv, pointsv, scale);
    }

    private updateShape(id: string, centroid: Vec2f) {
        renderer.shapes[id]?.moveTo(vec2f2vector2(centroid));
    }

    private processPhysicsPayload(payload: DeepImmutable<PhysicsPayload>) {
        console.log(payload);
        switch (payload.type) {
            case "ENTITY_DUMP":
                renderer.clearShapes();
                for (let entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points);
                }
                break;
            case "POSITION_DUMP":
                for (let update of payload.updates) {
                    this.updateShape(update.id, update.position);
                }
                break;
        }
    }
}