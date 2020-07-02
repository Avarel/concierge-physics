import { Renderer } from "./renderer";
import * as ConciergeAPI from "./concierge_api";
import { PhysicsHandler } from "./physics_handler";

let canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
if (!canvas) {
    throw "Canvas is not found!";
}
canvas.focus();

var url = prompt("Please enter the server address", "ws://127.0.0.1:64209/ws")

if (url == "debug") {
    let renderer = new Renderer(canvas);
    renderer.scene = renderer.createScene();
    renderer.start();
    throw "Debug mode"
}

if (!url || url.length == 0) {
    throw alert("A server address is required, please restart the webpage.")
}

var person = prompt("Please enter your name", "anthony");
if (!person || person.length == 0) {
    throw alert("A valid name, please restart the webpage.")
}

export let renderer = new Renderer(canvas);
renderer.scene = renderer.createScene();

export let client = new ConciergeAPI.Client(person, url, true);
let handler = new PhysicsHandler();
client.handlers.push(handler);
client.connect();

renderer.start();

