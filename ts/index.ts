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

var url: string | null | undefined;

// ws://compute-cpu2.cms.caltech.edu:64209/ws

while (!url || url.length == 0) {
    url = prompt("Please enter the server address", "ws://127.0.0.1:64209/ws")
}

var person: string | null | undefined;

while (!person || person.length == 0) {
    person = prompt("Please enter your name", "anthony")
}

export let client = new PhysicsSimulationClient(person, url, true);
client.connect();

renderer.start();