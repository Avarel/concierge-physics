import { Renderer } from "./renderer";
import { PhysicsSimulationClient } from "./physics_engine_client"

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

export let client = new PhysicsSimulationClient(person, url, true);
client.connect();

renderer.start();

