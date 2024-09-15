function main() {
    const canvas = document.getElementById("renderCanvas");
    
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const engine = new BABYLON.Engine(canvas, true);

    const audiourl = '/music/ddn.mp3';
    const audio = new Audio(audiourl)

    function createScene() {
        const scene = new BABYLON.Scene(engine);

        let Cube = null;
        
            // メッシュを非同期でロード
        BABYLON.SceneLoader.ImportMeshAsync("", "/scene/", "sample2.glb", scene).then((result) => {
            // 読み込まれたメッシュを取得
            Cube = result.meshes.find(mesh => mesh.name === "Cube");
            if (!Cube) {
                console.error("Cube mesh not found in the loaded scene.");
            }
        });

        

        //const leftJoystick = new BABYLON.VirtualJoystick(true);
        //const rightJoystick = new BABYLON.VirtualJoystick(false);

        //leftJoystick.deltaPosition.x;
        //leftJoystick.deltaPosition.y;

        // UniversalCamera の設定
        //const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(0, 1, -3), scene);
        //camera.setTarget(BABYLON.Vector3.Zero());
        //camera.attachControl(canvas, true);
        //camera.speed = 0.5; // カメラの移動速度を設定（必要に応じて調整）
        //camera.angularSensibility = 5000; // マウス感度を設定（必要に応じて調整）
        //camera.wheelDeltaPercentage = 0.01; // ホイールの動作速度を設定

        
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // Enable mouse wheel inputs.
        camera.inputs.addMouseWheel();
    
    
        camera.setTarget(BABYLON.Vector3.Zero());

    
        camera.attachControl(true);


        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        const pointerToKey = new Map()    

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN://クリックが押されたときの判定
                    // Only take action if the pointer is down on a mesh
                    if(pointerInfo.pickInfo.hit) {
                        let pickedMesh = pointerInfo.pickInfo.pickedMesh;
                        let pointerId = pointerInfo.event.pointerId;
                        if (Cube && pickedMesh === Cube) {//メッシュ名判定
                            console.log("Cube clicked! Moving it down...");
                            pickedMesh.position.y -= 0.5; // Move the key downward
                            audio.play().catch(error => {
                                console.error("Audio playback failed:", error);
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
                    // Only take action if the released pointer was recorded in pointerToKey
                    if (pointerToKey.has(pointerId)) {
                        const keyData = pointerToKey.get(pointerId);
                        if (keyData.mesh === Cube) {
                            Cube.position.y += 0.5;
                            keyData.note.pause();
                            keyData.note.currentTime = 0; // Reset the audio to the beginning
                            pointerToKey.delete(pointerId);
                        }
                    }
                    break;
            }
        });

        scene.debugLayer.show();

        return scene;
    }
    
    const scene = createScene();
    
    engine.runRenderLoop(() => {
         scene.render();
    });

    window.addEventListener("resize", () => { engine.resize(); });

    //window.addEventListener('click', () => {
    //    audio.play().catch(error => {
    //        console.error("Audio playback failed:", error);
    //    });
    //});    

    
}

window.addEventListener('DOMContentLoaded', main);
