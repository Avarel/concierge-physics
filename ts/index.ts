import { Renderer } from "./renderer";

export let renderer = new Renderer(document.querySelector<HTMLCanvasElement>("renderCanvas")!);
renderer.scene = renderer.createScene();
renderer.start();