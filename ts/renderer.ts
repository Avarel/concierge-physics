import { Engine, Scene, Vector2, Vector3, UniversalCamera, Mesh, DeepImmutableObject } from "babylonjs";
import * as BABYLON from 'babylonjs';

export class Renderer {
    canvas: HTMLCanvasElement;
    shapes: Record<string, Shape>;
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
                this.shapes[key].mesh.dispose();
                delete this.shapes[key];
            }
        }
    }

    createScene(): Scene {
        let scene = new Scene(this.engine);
        let camera = new UniversalCamera("UniversalCamera", new Vector3(0, 250, -250), scene);
        camera.setTarget(Vector3.Zero());
        camera.speed = 10;
        // camera.attachControl(this.canvas, true);
    
        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
        light.intensity = 0.5;

        return scene;
    }

    createPolygon(id: string, centroid: Vector2, points: Vector2[], scale: number = 1) {
        if (this.scene == undefined) {
            this.scene = this.createScene();
        }
        this.shapes[id] = Shape.createPolygon(centroid, points, this.scene, scale);
    }

    start() {
        let scene = this.createScene();
        this.scene = scene;
    
        this.engine.runRenderLoop(() => {
            console.log(scene);
            scene.render();
        });
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
        let mesh = poly_tri.build(undefined, 5);
        return new Shape(centroid, mesh);
    }

    moveTo(point: DeepImmutableObject<Vector2>) {
        let translate = point.subtract(this.centroid);
        let translate3 = new Vector3(translate.x, 0, translate.y);

        this.mesh.position.addInPlace(translate3);
        this.centroid.set(point.x, point.y);
    }
}
