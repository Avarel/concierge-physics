/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./ts/index.ts","vendors~index"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ts/concierge.ts":
/*!*************************!*\
  !*** ./ts/concierge.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.StatusCode = void 0;\nfunction assertUuid(uuid) {\n    return uuid;\n}\nvar StatusCode;\n(function (StatusCode) {\n    StatusCode[StatusCode[\"OK\"] = 2000] = \"OK\";\n    StatusCode[StatusCode[\"MESSAGE_SENT\"] = 2001] = \"MESSAGE_SENT\";\n    StatusCode[StatusCode[\"SUBSCRIBED\"] = 2002] = \"SUBSCRIBED\";\n    StatusCode[StatusCode[\"UNSUBSCRIBED\"] = 2003] = \"UNSUBSCRIBED\";\n    StatusCode[StatusCode[\"CREATED_GROUP\"] = 2004] = \"CREATED_GROUP\";\n    StatusCode[StatusCode[\"DELETED_GROUP\"] = 2005] = \"DELETED_GROUP\";\n    StatusCode[StatusCode[\"BAD\"] = 4000] = \"BAD\";\n    StatusCode[StatusCode[\"UNSUPPORTED\"] = 4001] = \"UNSUPPORTED\";\n    StatusCode[StatusCode[\"PROTOCOL\"] = 4002] = \"PROTOCOL\";\n    StatusCode[StatusCode[\"GROUP_ALREADY_CREATED\"] = 4003] = \"GROUP_ALREADY_CREATED\";\n    StatusCode[StatusCode[\"NO_SUCH_NAME\"] = 4004] = \"NO_SUCH_NAME\";\n    StatusCode[StatusCode[\"NO_SUCH_UUID\"] = 4005] = \"NO_SUCH_UUID\";\n    StatusCode[StatusCode[\"NO_SUCH_GROUP\"] = 4006] = \"NO_SUCH_GROUP\";\n})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));\n\n\n//# sourceURL=webpack:///./ts/concierge.ts?");

/***/ }),

/***/ "./ts/index.ts":
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.client = exports.renderer = void 0;\nconst renderer_1 = __webpack_require__(/*! ./renderer */ \"./ts/renderer.ts\");\nconst physics_engine_client_1 = __webpack_require__(/*! ./physics_engine_client */ \"./ts/physics_engine_client.ts\");\nlet canvas = document.querySelector(\"#renderCanvas\");\nif (!canvas) {\n    throw \"Canvas is not found!\";\n}\nexports.renderer = new renderer_1.Renderer(canvas);\nexports.renderer.scene = exports.renderer.createScene();\nexports.client = new physics_engine_client_1.PhysicsSimulationClient(\"anthony\", \"ws://127.0.0.1:8080/ws\");\nexports.renderer.start();\n\n\n//# sourceURL=webpack:///./ts/index.ts?");

/***/ }),

/***/ "./ts/physics_engine_client.ts":
/*!*************************************!*\
  !*** ./ts/physics_engine_client.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.PhysicsSimulationClient = void 0;\nconst ConciergeAPI = __webpack_require__(/*! ./concierge */ \"./ts/concierge.ts\");\nconst babylonjs_1 = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nconst _1 = __webpack_require__(/*! . */ \"./ts/index.ts\");\nconst PHYSICS_ENGINE_NAME = \"physics_engine\";\nconst PHYSICS_ENGINE_GROUP = \"physics_engine_out\";\nfunction vec2f2vector2(vec) {\n    return new babylonjs_1.Vector2(vec.x, vec.y);\n}\nclass PhysicsSimulationClient {\n    constructor(name, url) {\n        this.name = name;\n        this.socket = new WebSocket(url);\n        this.socket.onopen = event => this.onOpen(event);\n        this.socket.onmessage = event => this.onReceive(event);\n        this.socket.onerror = event => console.log(event);\n        this.socket.onclose = event => this.onClose(event);\n    }\n    send(payload) {\n        this.socket.send(JSON.stringify(payload));\n    }\n    close(code, reason) {\n        this.socket.close(code, reason);\n    }\n    onOpen(event) {\n        this.send({\n            operation: \"IDENTIFY\",\n            name: this.name\n        });\n    }\n    onClose(event) {\n        console.warn(event.code, event.reason);\n        clearInterval(this.subscribeInterval);\n    }\n    onReceive(event) {\n        let payload = JSON.parse(event.data);\n        this.processConciergePayload(payload);\n    }\n    trySubscribe() {\n        let subFn = () => {\n            console.log(\"Attempting to subscribe to \", PHYSICS_ENGINE_GROUP);\n            this.send({\n                operation: \"SUBSCRIBE\",\n                group: PHYSICS_ENGINE_GROUP\n            });\n        };\n        subFn();\n        this.subscribeInterval = setInterval(subFn, 5000);\n    }\n    cancelSubscribe() {\n        clearInterval(this.subscribeInterval);\n        this.subscribeInterval = undefined;\n    }\n    onSubscribe() {\n        console.log(\"Subscribed!\");\n        this.send({\n            operation: \"MESSAGE\",\n            target: {\n                type: \"NAME\",\n                name: PHYSICS_ENGINE_NAME\n            },\n            data: {\n                type: \"FETCH_ENTITIES\"\n            }\n        });\n    }\n    processConciergePayload(payload) {\n        switch (payload.operation) {\n            case \"HELLO\":\n                this.uuid = payload.uuid;\n                this.trySubscribe();\n                break;\n            case \"MESSAGE\":\n                if (payload.origin.name != PHYSICS_ENGINE_NAME) {\n                    return;\n                }\n                this.processPhysicsPayload(payload.data);\n                break;\n            case \"STATUS\":\n                switch (payload.code) {\n                    case ConciergeAPI.StatusCode.NO_SUCH_GROUP:\n                        if (payload.data == PHYSICS_ENGINE_GROUP) {\n                            console.error(\"Group \", PHYSICS_ENGINE_GROUP, \" does not exist on concierge, is the simulation server on?\");\n                        }\n                        break;\n                    case ConciergeAPI.StatusCode.SUBSCRIBED:\n                        if (payload.data == PHYSICS_ENGINE_GROUP) {\n                            this.cancelSubscribe();\n                            this.onSubscribe();\n                        }\n                        break;\n                    case ConciergeAPI.StatusCode.UNSUBSCRIBED:\n                        if (payload.data == PHYSICS_ENGINE_GROUP) {\n                            this.trySubscribe();\n                        }\n                        break;\n                }\n                break;\n        }\n    }\n    createShape(id, centroid, points, scale = 1) {\n        let centroidv = vec2f2vector2(centroid);\n        let pointsv = points.map(vec2f2vector2);\n        _1.renderer.createPolygon(id, centroidv, pointsv, scale);\n    }\n    updateShape(id, centroid) {\n        let shape = _1.renderer.shapes[id];\n        if (shape) {\n            shape.moveTo(vec2f2vector2(centroid));\n        }\n        else {\n            console.warn(\"Shape \", id, \" not registered with client\");\n        }\n    }\n    processPhysicsPayload(payload) {\n        switch (payload.type) {\n            case \"ENTITY_DUMP\":\n                console.log(\"Dumping entities!\");\n                _1.renderer.clearShapes();\n                for (let entity of payload.entities) {\n                    this.createShape(entity.id, entity.centroid, entity.points);\n                }\n                break;\n            case \"POSITION_DUMP\":\n                for (let update of payload.updates) {\n                    this.updateShape(update.id, update.position);\n                }\n                break;\n            default:\n                console.log(payload);\n                break;\n        }\n    }\n}\nexports.PhysicsSimulationClient = PhysicsSimulationClient;\n\n\n//# sourceURL=webpack:///./ts/physics_engine_client.ts?");

/***/ }),

/***/ "./ts/renderer.ts":
/*!************************!*\
  !*** ./ts/renderer.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Shape = exports.Renderer = void 0;\nconst babylonjs_1 = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nconst BABYLON = __webpack_require__(/*! babylonjs */ \"./node_modules/babylonjs/babylon.js\");\nclass Renderer {\n    constructor(canvas) {\n        this.canvas = canvas;\n        this.shapes = {};\n        this.engine = new babylonjs_1.Engine(canvas, true);\n    }\n    clearShapes() {\n        for (let key in this.shapes) {\n            if (this.shapes.hasOwnProperty(key)) {\n                this.shapes[key].mesh.dispose();\n                delete this.shapes[key];\n            }\n        }\n    }\n    createScene() {\n        let scene = new babylonjs_1.Scene(this.engine);\n        let camera = new babylonjs_1.UniversalCamera(\"UniversalCamera\", new babylonjs_1.Vector3(500, 250, -250), scene);\n        camera.setTarget(new babylonjs_1.Vector3(500, 0, 500));\n        camera.speed = 5;\n        camera.attachControl(this.canvas, true);\n        camera.keysDownward.push(17);\n        camera.keysUpward.push(32);\n        camera.keysUp.push(87);\n        camera.keysDown.push(83);\n        camera.keysLeft.push(65);\n        camera.keysRight.push(68);\n        let light = new BABYLON.HemisphericLight(\"light1\", new BABYLON.Vector3(0, 10, 0), scene);\n        light.intensity = 0.5;\n        return scene;\n    }\n    createPolygon(id, centroid, points, scale = 1) {\n        if (this.scene) {\n            this.shapes[id] = Shape.createPolygon(centroid, points, this.scene, scale);\n        }\n    }\n    start() {\n        if (this.scene == undefined) {\n            this.scene = this.createScene();\n        }\n        let renderFunc = () => {\n            if (this.scene) {\n                this.scene.render();\n            }\n            else {\n                this.engine.stopRenderLoop(renderFunc);\n            }\n        };\n        this.engine.runRenderLoop(renderFunc);\n    }\n    stop() {\n        this.engine.stopRenderLoop();\n    }\n}\nexports.Renderer = Renderer;\nclass Shape {\n    constructor(centroid, mesh) {\n        this.centroid = centroid;\n        this.mesh = mesh;\n    }\n    static createPolygon(centroid, points, scene, scale = 1) {\n        let corners = points.map((v) => v.scale(scale));\n        let poly_tri = new BABYLON.PolygonMeshBuilder(\"polytri\", corners, scene);\n        let mesh = poly_tri.build(undefined, 50);\n        return new Shape(centroid, mesh);\n    }\n    moveTo(point) {\n        let translate = point.subtract(this.centroid);\n        let translate3 = new babylonjs_1.Vector3(translate.x, 0, translate.y);\n        this.mesh.position.addInPlace(translate3);\n        this.centroid.set(point.x, point.y);\n    }\n}\nexports.Shape = Shape;\n\n\n//# sourceURL=webpack:///./ts/renderer.ts?");

/***/ })

/******/ });