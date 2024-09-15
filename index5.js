function main() {
    const canvas = document.getElementById("renderCanvas");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    const engine = new BABYLON.Engine(canvas, true);

    function createScene() {
        const scene = new BABYLON.Scene(engine);
        //scene.collisionsEnabled = true;

        let Cube = null;

        // メッシュを非同期でロード
        BABYLON.SceneLoader.ImportMeshAsync("", "/scene/", "SBgll.glb", scene).then((result) => {
            const primitives = [];

            for (let i = 0; i <= 252; i++) {
                const meshName = `Cube.170_primitive${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    primitives.push(mesh);
                }
            }

            if (primitives.length > 0) {
                Cube = BABYLON.Mesh.MergeMeshes(primitives, true, true, undefined, false, true);
                Cube.name = "Cube";
                Cube.checkCollisions = true;
                if(Cube.checkCollisions){
                    console.log("cube collision");
                }
            }

            return Cube;
        });

        // カメラ設定
        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 34, -20), scene);  // 初期位置をCubeから少し離す
        camera.setTarget(new BABYLON.Vector3(0, 10, 0));
        camera.attachControl(canvas, true);
        //camera.ellipsoid = new BABYLON.Vector3(10, 10, 10);  // 楕円体のサイズを調整
        //camera.checkCollisions = true;
        camera.inputs.addMouseWheel();

        if(camera.checkCollisions){
            console.log("camera collision");
        }

        
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        //Set gravity for the scene (G force like, on Y-axis)
        scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

        // Enable Collisions
        scene.collisionsEnabled = true;

        //Then apply collisions and gravity to the active camera
        camera.checkCollisions = true;
        camera.applyGravity = true;

        //Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new BABYLON.Vector3(3,3,3);

        //finally, say which mesh will be collisionable
        //Cube.checkCollisions = true;
        
        return scene;
    }

    /*createScene().then((scene) => {
        engine.runRenderLoop(() => {
            scene.render();
        });

        // コリジョンのデバッグ
        scene.registerBeforeRender(function () {
            if (Cube) {
                const cameraPosition = camera.position;
                const cameraEllipsoid = camera.ellipsoid;

                const collisionInfo = scene.pickWithRay(new BABYLON.Ray(cameraPosition, BABYLON.Vector3.Down(), cameraEllipsoid.y));
                
                if (collisionInfo.hit && collisionInfo.distance < cameraEllipsoid.y) {
                    camera.position.y += (cameraEllipsoid.y - collisionInfo.distance);
                }
            }
        });
    }).catch((error) => {
        console.error("Error loading scene:", error);
    });*/

    const scene = createScene();
    
    engine.runRenderLoop(() => {
         scene.render();
    });

    window.addEventListener("resize", () => { engine.resize(); });
}

window.addEventListener('DOMContentLoaded', main);
