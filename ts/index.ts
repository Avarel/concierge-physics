import { Renderer } from "./renderer";
import { PhysicsSimulationClient } from "./physics_engine_client"

let canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
if (!canvas) {
    throw "Canvas is not found!";
}

export let renderer = new Renderer(canvas);
renderer.scene = renderer.createScene();

// let corners = [new Vector2(4, -4),
// new Vector2(2, 0),
// new Vector2(5, 2),
// new Vector2(1, 2),
// new Vector2(-5, 5),
// new Vector2(-3, 1),
// new Vector2(-4, -4),
// new Vector2(-2, -3),
// new Vector2(2, -3),
// ];
// renderer.createPolygon("wowzers", Vector2.Zero(), corners, 1);

export let client = new PhysicsSimulationClient("anthony", "ws://127.0.0.1:8080/ws", true);
client.connect();

renderer.start();