function main() {
    const canvas = document.getElementById("renderCanvas");
    
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const engine = new BABYLON.Engine(canvas, true);

    const audiourl = '/music/ddn.mp3';
    const audio = new Audio(audiourl)

    const bdurl = '/music/bd.mp3';
    const bdaudio = new Audio(bdurl)

    const cracynurl = '/music/cracyn.mp3';
    const cracynaudio = new Audio(cracynurl)

    const cracyn2url = '/music/cracyn2.mp3';
    const cracyn2audio = new Audio(cracyn2url)

    const flotamurl = '/music/flotam.mp3';
    const flotamaudio = new Audio(flotamurl)

    const hihatclurl = '/music/hihatcl.mp3';
    const hihatclaudio = new Audio(hihatclurl)

    const hihatopurl = '/music/hihatop.mp3';
    const hihatopaudio = new Audio(hihatopurl)

    const hitamurl = '/music/hitam.mp3';
    const hitamaudio = new Audio(hitamurl)

    const lowtamurl = '/music/lowtam.mp3';
    const lowtamaudio = new Audio(lowtamurl)

    const ridecynurl = '/music/ridecyn.mp3';
    const ridecynaudio = new Audio(ridecynurl)

    const snareurl = '/music/snare.mp3';
    const snareaudio = new Audio(snareurl)

    function createScene() {
        const scene = new BABYLON.Scene(engine);

        let Cube = null;
        
            // メッシュをロード
        BABYLON.SceneLoader.ImportMeshAsync("", "/scene/", "drumset3.glb", scene).then((result) => {
            
            result.meshes.forEach((mesh) => {
                console.log("Loaded mesh name:", mesh.name);
            });
            
            hihatop = result.meshes.find(mesh => mesh.name === "hihatop");
            if (!hihatop) {
                console.error("hihatop mesh not found in the loaded scene.");
            }

            hihatcl = result.meshes.find(mesh => mesh.name === "hihatcl");
            if (!hihatcl) {
                console.error("hihatcl mesh not found in the loaded scene.");
            }

            cracyn = result.meshes.find(mesh => mesh.name === "cracyn");
            if (!cracyn) {
                console.error("cracyn mesh not found in the loaded scene.");
            }

            cracyn2 = result.meshes.find(mesh => mesh.name === "cracyn2");
            if (!cracyn2) {
                console.error("cracyn mesh not found in the loaded scene.");
            }

            ridecyn = result.meshes.find(mesh => mesh.name === "ridecyn");
            if (!ridecyn) {
                console.error("ridecyn mesh not found in the loaded scene.");
            }

            const primitives = [];

            for (let i = 0; i <= 5; i++) {
                const meshName = `bd_primitive${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    primitives.push(mesh);
                }
            }

            if (primitives.length > 0) {
                bd = BABYLON.Mesh.MergeMeshes(primitives, true, true, undefined, false, true);
                bd.name = "bd";
                bd.checkCollisions = true;
            }

            const primitives1 = [];

            for (let i = 0; i <= 5; i++) {
                const meshName = `snare_primitive${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    primitives1.push(mesh);
                }
            }

            if (primitives1.length > 0) {
                snare = BABYLON.Mesh.MergeMeshes(primitives1, true, true, undefined, false, true);
                snare.name = "snare";
                snare.checkCollisions = true;
            }


            const primitives2 = [];

            for (let i = 0; i <= 5; i++) {
                const meshName = `hitam_primitive${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    primitives2.push(mesh);
                }
            }

            if (primitives2.length > 0) {
                hitam = BABYLON.Mesh.MergeMeshes(primitives2, true, true, undefined, false, true);
                hitam.name = "hitam";
                hitam.checkCollisions = true;
            }


            const primitives3 = [];

            for (let i = 0; i <= 5; i++) {
                const meshName = `lowtam_primitive${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    primitives3.push(mesh);
                }
            }

            if (primitives3.length > 0) {
                lowtam = BABYLON.Mesh.MergeMeshes(primitives3, true, true, undefined, false, true);
                lowtam.name = "lowtam";
                lowtam.checkCollisions = true;
            }


            const primitives4 = [];

            for (let i = 0; i <= 5; i++) {
                const meshName = `flotam_primitive${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    primitives4.push(mesh);
                }
            }

            if (primitives4.length > 0) {
                flotam = BABYLON.Mesh.MergeMeshes(primitives4, true, true, undefined, false, true);
                flotam.name = "flotam";
                flotam.checkCollisions = true;
            }
        });
        

        
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 6, 6), scene);

        
        camera.inputs.addMouseWheel();
    
    
        camera.setTarget(new BABYLON.Vector3(0, 2, 0));
    
        
        camera.attachControl(canvas, true);


        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        const pointerToKey = new Map()    

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN://クリックが押されたときの判定
                    
                    if(pointerInfo.pickInfo.hit) {
                        console.log("clicked");
                        let pickedMesh = pointerInfo.pickInfo.pickedMesh;
                        let pointerId = pointerInfo.event.pointerId;
                        if (hihatop && pickedMesh === hihatop) {//メッシュ名判定
                            console.log("hihatop!");
                            pickedMesh.position.y -= 0.1; 
                            hihatopaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (bd && pickedMesh === bd) {
                            console.log("bd!");
                            pickedMesh.position.y -= 0.1; 
                            bdaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (snare && pickedMesh === snare) {
                            console.log("snare!");
                            pickedMesh.position.y -= 0.1; 
                            snareaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (hitam && pickedMesh === hitam) {
                            console.log("hitam!");
                            pickedMesh.position.y -= 0.1; 
                            hitamaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (lowtam && pickedMesh === lowtam) {
                            console.log("lowtam!");
                            pickedMesh.position.y -= 0.1; 
                            lowtamaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (flotam && pickedMesh === flotam) {
                            console.log("flotam!");
                            pickedMesh.position.y -= 0.1; 
                            flotamaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (hihatcl && pickedMesh === hihatcl) {
                            console.log("hihatcl!");
                            pickedMesh.position.y -= 0.1; 
                            hihatclaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (cracyn && pickedMesh === cracyn) {
                            console.log("cracyn!");
                            pickedMesh.position.y -= 0.1; 
                            cracynaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (cracyn2 && pickedMesh === cracyn2) {
                            console.log("cracyn2!");
                            pickedMesh.position.y -= 0.1; 
                            cracyn2audio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                        if (ridecyn && pickedMesh === ridecyn) {
                            console.log("ridecyn!");
                            pickedMesh.position.y -= 0.1; 
                            ridecynaudio.play().catch(error => {
                                console.error("Audio failed:", error);
                            });
                            pointerToKey.set(pointerId, {
                                mesh: pickedMesh,
                                note: audio,
                            });
                        }
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP://クリックが離されたときの判定
                    let pointerId = pointerInfo.event.pointerId;
                    
                    if (pointerToKey.has(pointerId)) {
                        const keyData = pointerToKey.get(pointerId);
                        if (keyData.mesh === hihatop) {
                            hihatop.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === bd) {
                            bd.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === hitam) {
                            hitam.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === lowtam) {
                            lowtam.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === flotam) {
                            flotam.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === snare) {
                            snare.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === cracyn) {
                            cracyn.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === cracyn2) {
                            cracyn2.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === ridecyn) {
                            ridecyn.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                        if (keyData.mesh === hihatcl) {
                            hihatcl.position.y += 0.1;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; 
                            pointerToKey.delete(pointerId);
                        }
                    }
                    break;
            }
        });

        

        return scene;
    }
    
    const scene = createScene();
    
    engine.runRenderLoop(() => {
         scene.render();
    });

    window.addEventListener("resize", () => { engine.resize(); });    

    
}

window.addEventListener('DOMContentLoaded', main);
