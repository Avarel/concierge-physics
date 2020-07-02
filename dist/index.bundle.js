!function(e){var t={};function n(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(s,o,function(t){return e[t]}.bind(null,o));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.client=t.renderer=void 0;const s=n(4),o=n(3),r=n(2);let i=document.querySelector("#renderCanvas");if(!i)throw"Canvas is not found!";i.focus();var a=prompt("Please enter the server address","ws://127.0.0.1:64209/ws");if("debug"==a){let e=new s.Renderer(i);throw e.scene=e.createScene(),e.start(),"Debug mode"}if(!a||0==a.length)throw alert("A server address is required, please restart the webpage.");var c=prompt("Please enter your name","anthony");if(!c||0==c.length)throw alert("A valid name, please restart the webpage.");t.renderer=new s.Renderer(i),t.renderer.scene=t.renderer.createScene(),t.client=new o.Client(c,a,!0);let l=new r.PhysicsSimulationHandler;t.client.handlers.push(l),t.client.connect(),t.renderer.start()},function(e,t){e.exports=BABYLON},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PhysicsSimulationHandler=t.PHYSICS_ENGINE_GROUP=t.PHYSICS_ENGINE_NAME=void 0;const s=n(3),o=n(1),r=n(0);function i(e){return new o.Vector2(e.x,e.y)}function a(e){function t(e){return Math.max(0,Math.min(e,255))/255}return new o.Color3(t(e[0]),t(e[1]),t(e[2]))}t.PHYSICS_ENGINE_NAME="physics_engine",t.PHYSICS_ENGINE_GROUP="physics_engine_out";class c extends s.EventHandler{constructor(){super(...arguments),this.subscribeInterval=5e3}onRecvHello(e,t){this.trySubscribe(e)}onRecvMessage(e,n){n.origin.name==t.PHYSICS_ENGINE_NAME&&this.processPhysicsPayload(n.data)}onRecvStatus(e,n){switch(n.code){case s.StatusCode.NO_SUCH_GROUP:n.data==t.PHYSICS_ENGINE_GROUP&&console.error("Group ",t.PHYSICS_ENGINE_GROUP," does not exist on concierge, is the simulation server on?");break;case s.StatusCode.SUBSCRIBED:n.data==t.PHYSICS_ENGINE_GROUP&&(this.cancelSubscribe(),this.onSubscribe(e));break;case s.StatusCode.UNSUBSCRIBED:n.data==t.PHYSICS_ENGINE_GROUP&&this.trySubscribe(e)}}trySubscribe(e){let n=()=>{console.log("Attempting to subscribe to ",t.PHYSICS_ENGINE_GROUP),e.sendJSON({operation:"SUBSCRIBE",group:t.PHYSICS_ENGINE_GROUP})};n(),this.subscribeHandle=window.setInterval(n,this.subscribeInterval)}onSubscribe(e){console.log("Subscribed!"),e.sendJSON({operation:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"FETCH_ENTITIES"}})}cancelSubscribe(){clearInterval(this.subscribeHandle),this.subscribeHandle=void 0}createShape(e,t,n,s,o=1){let c=i(t),l=n.map(i),h=a(s);r.renderer.createPolygon(e,c,l,h,o)}updateShape(e,t){let n=r.renderer.shapes[e];n?n.moveTo(i(t)):console.warn("Shape ",e," not registered with client")}updateColor(e,t){let n=r.renderer.shapes[e];n?n.setColor(a(t)):console.warn("Shape ",e," not registered with client")}processPhysicsPayload(e){switch(e.type){case"ENTITY_DUMP":console.log("Dumping entities!"),r.renderer.clearShapes();for(let t of e.entities)this.createShape(t.id,t.centroid,t.points,t.color);break;case"POSITION_DUMP":for(let t of e.updates)this.updateShape(t.id,t.position);break;case"COLOR_UPDATE":this.updateColor(e.id,e.color);break;default:console.log(e)}}}t.PhysicsSimulationHandler=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.EventHandler=t.Client=t.StatusCode=void 0,function(e){e[e.OK=2e3]="OK",e[e.MESSAGE_SENT=2001]="MESSAGE_SENT",e[e.SUBSCRIBED=2002]="SUBSCRIBED",e[e.UNSUBSCRIBED=2003]="UNSUBSCRIBED",e[e.CREATED_GROUP=2004]="CREATED_GROUP",e[e.DELETED_GROUP=2005]="DELETED_GROUP",e[e.BAD=4e3]="BAD",e[e.UNSUPPORTED=4001]="UNSUPPORTED",e[e.PROTOCOL=4002]="PROTOCOL",e[e.GROUP_ALREADY_CREATED=4003]="GROUP_ALREADY_CREATED",e[e.NO_SUCH_NAME=4004]="NO_SUCH_NAME",e[e.NO_SUCH_UUID=4005]="NO_SUCH_UUID",e[e.NO_SUCH_GROUP=4006]="NO_SUCH_GROUP"}(t.StatusCode||(t.StatusCode={}));t.Client=class{constructor(e,t,n=!1){this.reconnectInterval=5e3,this.handlers=[],this.url=t,this.name=e,this.reconnect=n}connect(){console.info("Trying to connect to ",this.url),this.socket=new WebSocket(this.url),this.socket.onopen=e=>this.onOpen(e),this.socket.onmessage=e=>this.onReceive(e),this.socket.onerror=e=>this.onError(e),this.socket.onclose=e=>this.onClose(e)}sendJSON(e){this.socket.send(JSON.stringify(e))}close(e,t,n=!0){this.socket.close(e,t),n&&this.reconnect&&(console.warn("Connection closed, reconnecting in",this.reconnectInterval,"ms"),setTimeout(()=>{this.connect()},this.reconnectInterval))}onOpen(e){var t;for(let n of this.handlers)null===(t=n.onOpen)||void 0===t||t.call(n,this,e);this.sendJSON({operation:"IDENTIFY",name:this.name})}onClose(e){var t;for(let n of this.handlers)null===(t=n.onClose)||void 0===t||t.call(n,this,e);console.warn(e.code,e.reason)}onReceive(e){var t;let n=JSON.parse(e.data);if(n.hasOwnProperty("operation")){let e=n;"HELLO"==e.operation&&(this.uuid=e.uuid);for(let n of this.handlers)null===(t=n.onReceive)||void 0===t||t.call(n,this,e)}}onError(e){var t;for(let n of this.handlers)null===(t=n.onError)||void 0===t||t.call(n,this,e);console.log(e)}};t.EventHandler=class{onReceive(e,t){var n,s,o,r,i,a,c,l,h;switch(t.operation){case"MESSAGE":null===(n=this.onRecvMessage)||void 0===n||n.call(this,e,t);break;case"HELLO":null===(s=this.onRecvHello)||void 0===s||s.call(this,e,t);break;case"GROUP_SUBS":null===(o=this.onRecvGroupSubs)||void 0===o||o.call(this,e,t);break;case"GROUP_LIST":null===(r=this.onRecvGroupList)||void 0===r||r.call(this,e,t);break;case"CLIENT_LIST":null===(i=this.onRecvClientList)||void 0===i||i.call(this,e,t);break;case"SUBS":null===(a=this.onRecvSubs)||void 0===a||a.call(this,e,t);break;case"CLIENT_JOIN":null===(c=this.onRecvClientJoin)||void 0===c||c.call(this,e,t);break;case"CLIENT_LEAVE":null===(l=this.onRecvClientLeave)||void 0===l||l.call(this,e,t);break;case"STATUS":null===(h=this.onRecvStatus)||void 0===h||h.call(this,e,t)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Shape=t.Renderer=void 0;const s=n(1),o=n(1),r=n(0),i=n(2);t.Renderer=class{constructor(e){this.canvas=e,this.shapes={},this.engine=new s.Engine(e,!0)}clearShapes(){var e;for(let t in this.shapes)if(this.shapes.hasOwnProperty(t)){let n=this.shapes[t];null===(e=this.generator)||void 0===e||e.removeShadowCaster(n.mesh),n.mesh.dispose(),delete this.shapes[t]}}createScene(){this.scene&&this.scene.dispose();let e=new s.Scene(this.engine),t=new s.UniversalCamera("UniversalCamera",new s.Vector3(500,800,-100),e);t.setTarget(new s.Vector3(500,0,500)),t.speed=15,t.attachControl(this.canvas,!0),t.keysDownward.push(17),t.keysUpward.push(32),t.keysUp.push(87),t.keysDown.push(83),t.keysLeft.push(65),t.keysRight.push(68);let n=new o.PointLight("light1",new o.Vector3(500,500,500),e);n.intensity=1;let r=e.createDefaultEnvironment({skyboxSize:1050,groundSize:1050,groundShadowLevel:.5,enableGroundShadow:!0});return r.ground.position.set(500,0,500),r.skybox.position.set(500,0,500),r.skybox.isPickable=!1,r.setMainColor(o.Color3.FromHexString("#74b9ff")),this.generator=new o.ShadowGenerator(512,n),e.createDefaultVRExperience({createDeviceOrientationCamera:!1}).enableTeleportation({floorMeshes:[r.ground]}),e}createPolygon(e,t,n,s,o=1){var r;if(this.scene){let i=a.createPolygon(e,t,n,this.scene,s,o);this.shapes[e]=i,null===(r=this.generator)||void 0===r||r.addShadowCaster(i.mesh)}}start(){null==this.scene&&(this.scene=this.createScene());let e=()=>{this.scene?this.scene.render():this.engine.stopRenderLoop(e)};this.engine.runRenderLoop(e),window.addEventListener("resize",()=>{this.engine.resize()})}stop(){this.engine.stopRenderLoop()}};class a{constructor(e,t){this.centroid=e,this.mesh=t}static createPolygon(e,t,n,c,l,h=1){let d=n.map(e=>e.scale(h)),u=new o.PolygonMeshBuilder("polytri",d,c).build(void 0,50);u.position.y+=50;var S=new o.StandardMaterial("myMaterial",c);return S.diffuseColor=l,u.material=S,u.actionManager=new o.ActionManager(c),u.actionManager.registerAction(new s.ExecuteCodeAction(o.ActionManager.OnPickTrigger,(function(){console.log("Clicking on object ",e,"."),r.client.sendJSON({operation:"MESSAGE",target:{type:"NAME",name:i.PHYSICS_ENGINE_NAME},data:{type:"TOGGLE_COLOR",id:e}})}))),new a(t,u)}setColor(e){this.mesh.material.diffuseColor=e}moveTo(e){let t=e.subtract(this.centroid),n=new s.Vector3(t.x,0,t.y);this.mesh.position.addInPlace(n),this.centroid.set(e.x,e.y)}}t.Shape=a}]);