import { Engine, Scene, Vector2, Vector3, UniversalCamera, Mesh, DeepImmutableObject } from "babylonjs";
import * as BABYLON from 'babylonjs';

export class Renderer {
    canvas: HTMLCanvasElement;
    shapes: { [_ in string]?: Shape };
    engine: Engine;
    scene?: Scene;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.shapes = {};
        this.engine = new Engine(canvas, true);
    }

    clearShapes() {
        for (let key in this.shapes) {
            if (this.shapes.hasOwnProperty(key)) {
                this.shapes[key]!.mesh.dispose();
                delete this.shapes[key];
            }
        }
    }

    createScene(): Scene {
        let scene = new Scene(this.engine);
        let camera = new UniversalCamera("UniversalCamera", new Vector3(500, 250, -250), scene);
        camera.setTarget(new Vector3(500, 0, 500));
        camera.speed = 5;
        camera.attachControl(this.canvas, true);
        camera.keysDownward.push(17); //CTRL
        camera.keysUpward.push(32); //SPACE
        camera.keysUp.push(87);    //W
        camera.keysDown.push(83)   //D
        camera.keysLeft.push(65);  //A
        camera.keysRight.push(68); //S

        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
        light.intensity = 0.5;

        return scene;
    }

    createPolygon(id: string, centroid: Vector2, points: Vector2[], scale: number = 1) {
        if (this.scene) {
            this.shapes[id] = Shape.createPolygon(centroid, points, this.scene, scale);
        }
    }

    start() {
        if (this.scene == undefined) {
            this.scene = this.createScene();
        }

        let renderFunc = () => {
            if (this.scene) {
                this.scene.render()
            } else {
                this.engine.stopRenderLoop(renderFunc)
            }
        };
        this.engine.runRenderLoop(renderFunc);
    }

    stop() {
        this.engine.stopRenderLoop();
    }
}

export class Shape {
    centroid: Vector2;
    mesh: Mesh;

    private constructor(centroid: Vector2, mesh: Mesh) {
        this.centroid = centroid;
        this.mesh = mesh;
    }

    static createPolygon(centroid: Vector2, points: Vector2[], scene: Scene, scale: number = 1): Shape {
        let corners = points.map((v) => v.scale(scale));
        let poly_tri = new BABYLON.PolygonMeshBuilder("polytri", corners, scene);
        let mesh = poly_tri.build(undefined, 50);
        return new Shape(centroid, mesh);
    }

    moveTo(point: DeepImmutableObject<Vector2>) {
        let translate = point.subtract(this.centroid);
        let translate3 = new Vector3(translate.x, 0, translate.y);

        this.mesh.position.addInPlace(translate3);
        this.centroid.set(point.x, point.y);
    }
}
