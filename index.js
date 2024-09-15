function main() {
    const canvas = document.getElementById("renderCanvas");
    
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const engine = new BABYLON.Engine(canvas, true);

    function createScene() {
        const scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;

        BABYLON.SceneLoader.ImportMeshAsync("", "/scene/", "sample2.glb", scene)
            .then(function (result) {
                console.log("Meshes loaded:", result.meshes);

                if (result.meshes && result.meshes.length > 0) {
                    const buttonMesh = result.meshes[0];
                    console.log("Button mesh:", buttonMesh);

                    if (!buttonMesh) {
                        console.error("Button mesh not found!");
                        return;
                    }

                    if (!buttonMesh.material) {
                        buttonMesh.material = new BABYLON.StandardMaterial("buttonMaterial", scene);
                        console.log("Material assigned to buttonMesh.");
                    }

                    buttonMesh.checkCollisions = true;
                    buttonMesh.scaling = new BABYLON.Vector3(1, 1, 1);
                    buttonMesh.isPickable = true;

                    buttonMesh.actionManager = new BABYLON.ActionManager(scene);

                    if (buttonMesh.actionManager) {
                        console.log("ActionManager exists on buttonMesh.");
                    } else {
                        console.error("No ActionManager on buttonMesh.");
                    }

                    buttonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, buttonMesh.material, "diffuseColor", new BABYLON.Color3(1, 0, 0), 100));
                    buttonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, buttonMesh.material, "diffuseColor", new BABYLON.Color3(1, 1, 1), 100));

                    buttonMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
                        console.log("ボタンがクリックされました！");
                        //const audioPlayer = document.getElementById('audioPlayer');
                        const audiourl = '/music/ddn.mp3';
                        const audio = new Audio(audiourl)
                        audio.play();
                    }));

                    buttonMesh.actionManager.actions.forEach(action => {
                        console.log("Action:", action);
                    });

                    console.log("ActionManager actions:", buttonMesh.actionManager.actions);

                } else {
                    console.error("No meshes were loaded from the GLB file.");
                }
            })
            .catch(function (error) {
                console.error("Error loading GLB file:", error);
            });

        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

        console.log("Camera checkCollisions:", camera.checkCollisions);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        scene.debugLayer.show();

        return scene;
    }
    
    const scene = createScene();
    
    engine.runRenderLoop(() => {
         scene.render();
    });

    window.addEventListener("resize", () => { engine.resize(); });

    window.addEventListener("click", function (event) {
        const pickResult = scene.pick(event.clientX, event.clientY);

        if (pickResult.hit) {
            console.log("Picked mesh:", pickResult.pickedMesh.name);
        } else {
            console.log("No mesh was picked");
        }
        
        console.log("Pick result details:", pickResult);
        if (pickResult.ray) {
            console.log("Pick ray origin:", pickResult.ray.origin);
            console.log("Pick ray direction:", pickResult.ray.direction);
        }
        if (pickResult.pickedMesh) {
            console.log("Picked mesh name:", pickResult.pickedMesh.name);
            console.log("Picked mesh ID:", pickResult.pickedMesh.id);
        }
    });
}

window.addEventListener('DOMContentLoaded', main);
