import * as ConciergeAPI from "./concierge_api";
import { DeepImmutable, Vector2, DeepImmutableArray, Color3 } from "babylonjs";
import { renderer } from ".";
import { Shape } from "./renderer";

export interface Vec2f {
    x: number,
    y: number
}

type RgbColor = [number, number, number];

export interface Entity {
    id: string,
    centroid: Vec2f,
    points: Vec2f[],
    color: RgbColor
}

export interface ToggleColor {
    type: "TOGGLE_COLOR",
    id: string,
}

export interface ColorUpdate {
    type: "COLOR_UPDATE",
    id: string,
    color: RgbColor
}

export interface EntityUpdate {
    id: string,
    position: Vec2f,
}

export interface FetchEntities {
    type: "FETCH_ENTITIES"
}

export interface FetchPositions {
    type: "FETCH_POSITIONS"
}

export interface EntityDump {
    type: "ENTITY_DUMP",
    entities: Entity[]
}

export interface PositionDump {
    type: "POSITION_DUMP"
    updates: EntityUpdate[]
}

type PhysicsPayload = EntityDump | PositionDump
    | FetchEntities | FetchPositions
    | ColorUpdate | ToggleColor;

export const PHYSICS_ENGINE_NAME = "physics_engine";
export const PHYSICS_ENGINE_GROUP = "physics_engine_out";

type ConciergePayload = ConciergeAPI.Payload<PhysicsPayload>;

function vec2f2vector2(vec: Vec2f): Vector2 {
    return new Vector2(vec.x, vec.y);
}

function tuple2color3(tuple: DeepImmutable<RgbColor>): Color3 {
    function clamp(n: number): number {
        return Math.max(0, Math.min(n, 255)) / 255
    }

    return new Color3(clamp(tuple[0]), clamp(tuple[1]), clamp(tuple[2]))
}

export class PhysicsHandler extends ConciergeAPI.EventHandler {
    subscribeInterval: number = 5000;
    subscribeHandle: number | undefined;

    onRecvHello(client: ConciergeAPI.Client, hello: ConciergeAPI.Hello) {
        this.trySubscribe(client);
    }

    onRecvMessage(client: ConciergeAPI.Client, message: ConciergeAPI.Message<any>) {
        if (message.origin!.name != PHYSICS_ENGINE_NAME) {
            return;
        }
        this.processPhysicsPayload(message.data as PhysicsPayload);
    }

    onRecvStatus(client: ConciergeAPI.Client, status: ConciergeAPI.Status<any>): void {
        switch (status.code) {
            case ConciergeAPI.StatusCode.NO_SUCH_GROUP:
                if (status.data == PHYSICS_ENGINE_GROUP) {
                    console.error("Group ", PHYSICS_ENGINE_GROUP, " does not exist on concierge, is the simulation server on?")
                }
                break;
            case ConciergeAPI.StatusCode.SUBSCRIBED:
                // subscription complete, stop trying to join
                if (status.data == PHYSICS_ENGINE_GROUP) {
                    this.cancelSubscribe();
                    this.onSubscribe(client);
                }
                break;
            case ConciergeAPI.StatusCode.UNSUBSCRIBED:
                if (status.data == PHYSICS_ENGINE_GROUP) {
                    this.trySubscribe(client);
                }
                break;
        }
    }

    private trySubscribe(client: ConciergeAPI.Client) {
        // try to subscribe until good ("STATUS" handle)
        let subFn = () => {
            console.log("Attempting to subscribe to ", PHYSICS_ENGINE_GROUP);
            client.sendJSON({
                type: "SUBSCRIBE",
                group: PHYSICS_ENGINE_GROUP
            });
        };

        subFn();
        this.subscribeHandle = window.setInterval(subFn, this.subscribeInterval);
    }

    private onSubscribe(client: ConciergeAPI.Client) {
        console.log("Subscribed!");
        client.sendJSON({
            type: "MESSAGE",
            target: {
                type: "NAME",
                name: PHYSICS_ENGINE_NAME
            },
            data: {
                type: "FETCH_ENTITIES"
            }
        });
    }

    private cancelSubscribe() {
        clearInterval(this.subscribeHandle)
        this.subscribeHandle = undefined;
    }


    private createShape(id: string, centroid: Vec2f, points: DeepImmutableArray<Vec2f>, color: DeepImmutable<RgbColor>, scale: number = 1) {
        let centroidv = vec2f2vector2(centroid);
        let pointsv = points.map(vec2f2vector2);
        let color3 = tuple2color3(color);
        renderer.createPolygon(id, centroidv, pointsv, color3, scale);
    }

    private updateShape(id: string, centroid: Vec2f) {
        let shape = renderer.shapes[id];
        if (shape) {
            shape.moveTo(vec2f2vector2(centroid));
        } else {
            console.warn("Shape ", id, " not registered with client")
        }
    }

    private updateColor(id: string, color: DeepImmutable<RgbColor>) {
        let shape = renderer.shapes[id];
        if (shape) {
            shape.setColor(tuple2color3(color));
        } else {
            console.warn("Shape ", id, " not registered with client")
        }
    }

    private processPhysicsPayload(payload: DeepImmutable<PhysicsPayload>) {
        switch (payload.type) {
            case "ENTITY_DUMP":
                console.log("Dumping entities!");
                renderer.clearShapes();
                for (let entity of payload.entities) {
                    this.createShape(entity.id, entity.centroid, entity.points, entity.color);
                }
                break;
            case "POSITION_DUMP":
                for (let update of payload.updates) {
                    this.updateShape(update.id, update.position);
                }
                break;
            case "COLOR_UPDATE":
                this.updateColor(payload.id, payload.color);
                break;
            default:
                console.log(payload);
                break;
        }
    }
}