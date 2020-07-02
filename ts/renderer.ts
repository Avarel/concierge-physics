import { Engine, Scene, Vector2, Vector3, UniversalCamera, Mesh, DeepImmutableObject, ShadowGenerator, Color3, StandardMaterial, ExecuteCodeAction } from "babylonjs";
import * as BABYLON from 'babylonjs';
import { client } from ".";
import { PHYSICS_ENGINE_NAME } from "./physics_engine_client";

export class Renderer {
    canvas: HTMLCanvasElement;
    shapes: { [_ in string]?: Shape };
    engine: Engine;
    scene?: Scene;
    generator?: ShadowGenerator;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.shapes = {};
        this.engine = new Engine(canvas, true);
    }

    clearShapes() {
        for (let key in this.shapes) {
            if (this.shapes.hasOwnProperty(key)) {
                let shape = this.shapes[key]!;
                this.generator?.removeShadowCaster(shape.mesh);
                shape.mesh.dispose();
                delete this.shapes[key];
            }
        }
    }

    createScene(): Scene {
        if (this.scene) {
            this.scene.dispose();
        }

        let scene = new Scene(this.engine);
        let camera = new UniversalCamera("UniversalCamera", new Vector3(500, 800, -100), scene);
        camera.setTarget(new Vector3(500, 0, 500));
        camera.speed = 15;
        camera.attachControl(this.canvas, true);
        camera.keysDownward.push(17); //CTRL
        camera.keysUpward.push(32); //SPACE
        camera.keysUp.push(87);    //W
        camera.keysDown.push(83)   //D
        camera.keysLeft.push(65);  //A
        camera.keysRight.push(68); //S

        let light = new BABYLON.PointLight("light1", new BABYLON.Vector3(500, 500, 500), scene);
        light.intensity = 1.0;

        let helper = scene.createDefaultEnvironment({
            skyboxSize: 1050,
            groundSize: 1050,
            groundShadowLevel: 0.5,
            enableGroundShadow: true
        });
        // recenter
        helper!.ground!.position.set(500, 0, 500);
        helper!.skybox!.position.set(500, 0, 500);
        helper!.skybox!.isPickable = false;
        helper!.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"));

        this.generator = new BABYLON.ShadowGenerator(512, light);

        var vrHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false });
        vrHelper.enableTeleportation({ floorMeshes: [helper!.ground!] });

        return scene;
    }

    createPolygon(id: string, centroid: Vector2, points: Vector2[], color: Color3, scale: number = 1) {
        if (this.scene) {
            let shape = Shape.createPolygon(id, centroid, points, this.scene, color, scale);
            this.shapes[id] = shape;
            this.generator?.addShadowCaster(shape.mesh);
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
        window.addEventListener("resize", () => {
            this.engine.resize();
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

    static createPolygon(id: string, centroid: Vector2, points: Vector2[], scene: Scene, color: Color3, scale: number = 1): Shape {
        let corners = points.map((v) => v.scale(scale));
        let poly_tri = new BABYLON.PolygonMeshBuilder("polytri", corners, scene);
        let mesh = poly_tri.build(undefined, 50);
        mesh.position.y += 50;

        var mat = new BABYLON.StandardMaterial("myMaterial", scene);
        mat.diffuseColor = color;
        mesh.material = mat;

        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                function() {
                    console.log("Clicking on object ", id, ".")
                    client.sendJSON({
                        operation: "MESSAGE",
                        target: {
                            type: "NAME",
                            name: PHYSICS_ENGINE_NAME
                        },
                        data: {
                            type: "TOGGLE_COLOR",
                            id: id,
                        }
                    })
                }
            )
        );

        return new Shape(centroid, mesh);
    }

    setColor(color: DeepImmutableObject<Color3>) {
        (this.mesh.material! as StandardMaterial).diffuseColor! = color;
    }

    moveTo(point: DeepImmutableObject<Vector2>) {
        let translate = point.subtract(this.centroid);
        let translate3 = new Vector3(translate.x, 0, translate.y);

        this.mesh.position.addInPlace(translate3);
        this.centroid.set(point.x, point.y);
    }
}
