!function(e){var t={};function n(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(s,o,function(t){return e[t]}.bind(null,o));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t){e.exports=BABYLON},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ServiceEventHandler=t.EventHandler=t.Client=void 0;t.Client=class{constructor(e,t,n=!1){this.reconnectInterval=1e4,this.handlers=[],this.url=t,this.name=e,this.reconnect=n}connect(e,t){console.info("Trying to connect to ",this.url),this.version=e,this.secret=t,this.socket=new WebSocket(this.url),this.socket.onopen=e=>this.onOpen(e),this.socket.onmessage=e=>this.onReceive(e),this.socket.onerror=e=>this.onError(e),this.socket.onclose=e=>this.onClose(e)}sendJSON(e){if(null==this.socket)throw new Error("Socket is not connected");this.socket.send(JSON.stringify(e))}close(e,t,n=!0){if(null==this.socket)throw new Error("Socket is not connected");this.socket.close(e,t),n?this.tryReconnect():(this.socket=void 0,this.version=void 0,this.secret=void 0)}tryReconnect(){this.reconnect&&(console.warn("Connection closed, reconnecting in",this.reconnectInterval,"ms"),setTimeout(()=>{this.connect(this.version,this.secret)},this.reconnectInterval))}onOpen(e){var t;for(let n of this.handlers)null===(t=n.onOpen)||void 0===t||t.call(n,e);if(null==this.version)throw new Error("Version is undefined");console.log("Identifying with version",this.version),this.sendJSON({type:"IDENTIFY",name:this.name,version:this.version,secret:this.secret})}onClose(e){var t;for(let n of this.handlers)null===(t=n.onClose)||void 0===t||t.call(n,e);console.warn(e.code,e.reason),this.tryReconnect()}onReceive(e){var t;let n=JSON.parse(e.data);if(n.hasOwnProperty("type")){let e=n;"HELLO"==e.type&&(this.uuid=e.uuid);for(let n of this.handlers)null===(t=n.onReceive)||void 0===t||t.call(n,e)}}onError(e){var t;for(let n of this.handlers)null===(t=n.onError)||void 0===t||t.call(n,e);console.log(e)}};class s{onReceive(e){var t,n,s,o,r,i,a,c,l;switch(e.type){case"MESSAGE":null===(t=this.onRecvMessage)||void 0===t||t.call(this,e);break;case"HELLO":null===(n=this.onRecvHello)||void 0===n||n.call(this,e);break;case"GROUP_SUB_LIST":null===(s=this.onRecvGroupSubs)||void 0===s||s.call(this,e);break;case"GROUP_LIST":null===(o=this.onRecvGroupList)||void 0===o||o.call(this,e);break;case"CLIENT_LIST":null===(r=this.onRecvClientList)||void 0===r||r.call(this,e);break;case"SUB_LIST":null===(i=this.onRecvSubs)||void 0===i||i.call(this,e);break;case"CLIENT_JOIN":null===(a=this.onRecvClientJoin)||void 0===a||a.call(this,e);break;case"CLIENT_LEAVE":null===(c=this.onRecvClientLeave)||void 0===c||c.call(this,e);break;case"STATUS":null===(l=this.onRecvStatus)||void 0===l||l.call(this,e)}}}t.EventHandler=s;t.ServiceEventHandler=class extends s{constructor(e,t){super(),this.subscribeInterval=5e3,this.client=e,this.group=t}onClose(e){this.onUnsubscribe(),this.cancelSubscribe()}trySubscribe(){let e=()=>{console.log("Attempting to subscribe to ",this.group),this.client.sendJSON({type:"SUBSCRIBE",group:this.group})};e(),this.subscribeHandle=window.setInterval(e,this.subscribeInterval)}cancelSubscribe(){clearInterval(this.subscribeHandle),this.subscribeHandle=void 0}onRecvStatus(e){switch(e.code){case"NO_SUCH_GROUP":e.group==this.group&&console.error("Group `",this.group,"` does not exist on concierge, is the simulation server on?");break;case"SUBSCRIBED":e.group==this.group&&(console.log("Subscribed to `",this.group,"`."),this.cancelSubscribe(),this.onSubscribe());break;case"UNSUBSCRIBED":e.group==this.group&&(console.log("Unsubscribed from `",this.group,"`."),this.trySubscribe(),this.onUnsubscribe())}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Shape=t.Renderer=void 0;const s=n(0),o=n(3),r=n(0);t.Renderer=class{constructor(e){this.canvas=e,this.engine=new s.Engine(e,!0)}createUITexture(){this.uiTexture&&this.uiTexture.dispose();let e=o.AdvancedDynamicTexture.CreateFullscreenUI("UI");this.uiTexture=e}createScene(){this.scene&&this.scene.dispose();let e=new s.Scene(this.engine),t=new s.UniversalCamera("UniversalCamera",new r.Vector3(500,800,-100),e);t.setTarget(new r.Vector3(500,0,500)),t.speed=15,t.attachControl(this.canvas,!0),t.keysDownward.push(17),t.keysUpward.push(32),t.keysUp.push(87),t.keysDown.push(83),t.keysLeft.push(65),t.keysRight.push(68);let n=new s.PointLight("light1",new s.Vector3(500,500,500),e);n.intensity=1;let o=e.createDefaultEnvironment({skyboxSize:1050,groundSize:1050,groundShadowLevel:.5,enableGroundShadow:!0});o.ground.position.set(500,0,500),o.skybox.position.set(500,0,500),o.skybox.isPickable=!1,o.setMainColor(s.Color3.FromHexString("#74b9ff")),this.generator=new s.ShadowGenerator(512,n),e.createDefaultVRExperience({createDeviceOrientationCamera:!1}).enableTeleportation({floorMeshes:[o.ground]}),this.scene=e}start(){null==this.scene&&this.createScene(),null==this.uiTexture&&this.createUITexture();let e=()=>{this.scene?this.scene.render():this.engine.stopRenderLoop(e)};this.engine.runRenderLoop(e),window.addEventListener("resize",()=>{this.engine.resize()})}stop(){this.engine.stopRenderLoop()}};class i{constructor(e,t){this.centroid=e,this.mesh=t}static createPolygon(e,t,n,o,r,a=1){let c=n.map(e=>e.scale(a)),l=new s.PolygonMeshBuilder("polytri",c,o).build(void 0,50);l.position.y+=50;var h=new s.StandardMaterial("myMaterial",o);return h.diffuseColor=r,l.material=h,l.actionManager=new s.ActionManager(o),new i(t,l)}setColor(e){this.mesh.material.diffuseColor=e}moveTo(e){let t=e.subtract(this.centroid),n=new r.Vector3(t.x,0,t.y);this.mesh.position.addInPlace(n),this.centroid.set(e.x,e.y)}}t.Shape=i},function(e,t){e.exports=BABYLON.GUI},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(2),o=n(1),r=n(5),i=n(6);let a=document.querySelector("#renderCanvas");if(!a)throw"Canvas is not found!";a.focus();var c=prompt("Please enter the server address","ws://127.0.0.1:64209/ws");if("debug"==c){throw new s.Renderer(a).start(),"Debug mode"}if(!c||0==c.length)throw alert("A server address is required, please restart the webpage.");var l=prompt("Please enter your name","anthony");if(!l||0==l.length)throw alert("A valid name, please restart the webpage.");let h=new s.Renderer(a),u=new o.Client(l,c,!0),d=new r.PhysicsHandler(u,h);u.handlers.push(d);let p=new i.ChatHandler(u,h);u.handlers.push(p),h.start(),u.connect("0.1.0")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PhysicsHandler=t.PHYSICS_ENGINE_GROUP=t.PHYSICS_ENGINE_NAME=void 0;const s=n(1),o=n(0),r=n(2);function i(e){return new o.Vector2(e.x,e.y)}function a(e){function t(e){return Math.max(0,Math.min(e,255))/255}return new o.Color3(t(e[0]),t(e[1]),t(e[2]))}t.PHYSICS_ENGINE_NAME="physics_engine",t.PHYSICS_ENGINE_GROUP="physics_engine_out";class c extends s.ServiceEventHandler{constructor(e,n){super(e,t.PHYSICS_ENGINE_GROUP),this.client=e,this.renderer=n,this.shapes=new Map}onRecvHello(e){this.trySubscribe()}onRecvMessage(e){e.origin.name==t.PHYSICS_ENGINE_NAME&&this.processPhysicsPayload(e.data)}onSubscribe(){this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"FETCH_ENTITIES"}})}onUnsubscribe(){this.clearShapes()}clearShapes(){var e;for(let t of this.shapes.keys())if(this.shapes.has(t)){let n=this.shapes.get(t);null===(e=this.renderer.generator)||void 0===e||e.removeShadowCaster(n.mesh),n.mesh.dispose(),this.shapes.delete(t)}}createPolygon(e,t,n,s,o=1){var i;if(this.renderer.scene){let a=r.Shape.createPolygon(e,t,n,this.renderer.scene,s,o);return this.shapes.set(e,a),null===(i=this.renderer.generator)||void 0===i||i.addShadowCaster(a.mesh),a}throw new Error("Scene not initialized!")}createShape(e,n,s,r,c=1){let l=i(n),h=s.map(i),u=a(r);this.createPolygon(e,l,h,u,c).mesh.actionManager.registerAction(new o.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,()=>{console.log("Clicking on object ",e,"."),this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"TOGGLE_COLOR",id:e}})}))}updateShape(e,t){let n=this.shapes.get(e);n?n.moveTo(i(t)):console.warn("Shape ",e," not registered with client")}updateColor(e,t){let n=this.shapes.get(e);n?n.setColor(a(t)):console.warn("Shape ",e," not registered with client")}processPhysicsPayload(e){switch(e.type){case"ENTITY_DUMP":console.log("Dumping entities!"),this.clearShapes();for(let t of e.entities)this.createShape(t.id,t.centroid,t.points,t.color);break;case"POSITION_DUMP":for(let t of e.updates)this.updateShape(t.id,t.position);break;case"COLOR_UPDATE":this.updateColor(e.id,e.color);break;default:console.log(e)}}}t.PhysicsHandler=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ChatHandler=void 0;const s=n(3),o=n(1);class r extends o.ServiceEventHandler{constructor(e,t){super(e,"chat"),this.renderer=t,this.client=e}onRecvHello(e){this.trySubscribe()}onSubscribe(){let e=new s.StackPanel;e.verticalAlignment=s.Control.VERTICAL_ALIGNMENT_BOTTOM,e.fontFamily="monospace";let t=new s.ScrollViewer;t.horizontalAlignment=s.Control.HORIZONTAL_ALIGNMENT_LEFT,t.verticalAlignment=s.Control.VERTICAL_ALIGNMENT_BOTTOM,t.heightInPixels=150,t.width=.4,t.thickness=0,t.background="#080808",t.thumbLength=.2,t.barSize=10;let n=new s.TextBlock;n.fontFamily="monospace",n.textHorizontalAlignment=s.Control.HORIZONTAL_ALIGNMENT_LEFT,n.resizeToFit=!0,n.color="white",n.textWrapping=s.TextWrapping.WordWrap,n.fontSizeInPixels=14,this.output=n,t.addControl(n),e.addControl(t);let o=new s.InputText;o.horizontalAlignment=s.Control.HORIZONTAL_ALIGNMENT_LEFT,o.fontFamily="monospace",o.width=.4,o.maxWidth=.4,o.heightInPixels=40,o.fontSizeInPixels=14,o.color="white",o.text="Click to chat.",o.thickness=0,o.background="black",o.onPointerClickObservable.add(e=>{"Click to chat."==o.text&&(o.text="")}),o.onKeyboardEventProcessedObservable.add(e=>{"Enter"==e.code&&this.onEnter()}),this.input=o,e.addControl(this.input),this.renderer.uiTexture.addControl(e)}onEnter(){this.client.sendJSON({type:"MESSAGE",target:{type:"GROUP",group:"chat"},data:this.input.text}),this.input.text="Click to chat."}onRecvMessage(e){"chat"==e.origin.group&&(0!=this.output.text.length&&(this.output.text+="\nz"),this.output.text+=`${e.origin.name}: ${e.data}`)}onUnsubscribe(){}}t.ChatHandler=r}]);