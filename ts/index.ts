import { Engine, Scene, Polygon, Vector2, Vector3, UniversalCamera } from "babylonjs";
import * as BABYLON from 'babylonjs';
import { test, ConciergeAPI } from "./concierge"

var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);

function createScene(): Scene {
    let scene = new Scene(engine);
    let camera = new UniversalCamera("UniversalCamera", new Vector3(0, 250, -250), scene);
    camera.setTarget(Vector3.Zero());
    camera.speed = 20;
    camera.attachControl(canvas, true);

    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
    light.intensity = 0.5;

    let corners = [new Vector2(4, -4),
    new Vector2(2, 0),
    new Vector2(5, 2),
    new Vector2(1, 2),
    new Vector2(-5, 5),
    new Vector2(-3, 1),
    new Vector2(-4, -4),
    new Vector2(-2, -3),
    new Vector2(2, -3),
    ];

    let poly_tri = new BABYLON.PolygonMeshBuilder("polytri", corners, scene);
    let polygon = poly_tri.build(undefined, 5);
    polygon.position.y = + 4;

    return scene;
}

interface Shape {
    mesh: Polygon,
    centroid: { x: number, y: number }
}

let scene: Scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});