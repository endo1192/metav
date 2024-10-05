function main() {
    const canvas = document.getElementById("renderCanvas");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const engine = new BABYLON.Engine(canvas, true);

    const audiourl = '/music/ddn.mp3';
    const audio = new Audio(audiourl);

    function createScene() {
        const scene = new BABYLON.Scene(engine);

        let Cube = null;

        // メッシュを非同期でロード
        BABYLON.SceneLoader.ImportMeshAsync("", "/scene/", "sado5.glb", scene).then((result) => {
            result.meshes.forEach((mesh) => {
                console.log("Loaded mesh name:", mesh.name);
            });
            
            Cube = result.meshes.find(mesh => mesh.name === "Cube.132");
            if (!Cube) {
                console.error("Cube mesh not found in the loaded scene.");
            }

            for (let i = 1; i <= 6; i++) {
                const meshName = `coli.00${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    mesh.checkCollisions = true;
                }
            }
        });

        // Set gravity for the scene (G force like, on Y-axis)
        scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(3, 2, 0), scene);

        // Enable mouse wheel inputs
        camera.inputs.addMouseWheel();
        camera.attachControl(canvas, true);
    
        camera.setTarget(BABYLON.Vector3.Zero());

        // Enable Collisions
        scene.collisionsEnabled = true;

        // Then apply collisions and gravity to the active camera
        camera.checkCollisions = true;

        // Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new BABYLON.Vector3(1,1,0.7);

        camera.applyGravity = true;

        camera.speed = 2;
        BABYLON.Engine.CollisionsEpsilon = 0.0001;
        camera.inertia = 0.8;

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);





        // ジャンプ中かどうかを管理するフラグ
        let isJumping = false;
        let jumpSpeed = 0.3;  // ジャンプの速度
        let jumpHeight = 2.1;   // ジャンプする最大高さ
        //let initialYPosition = camera.position.y;  // カメラの初期位置


        // GUIのAdvancedDynamicTextureを作成
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // ジャンプボタンを作成
        const jumpButton = BABYLON.GUI.Button.CreateSimpleButton("jumpButton", "Jump");
        jumpButton.width = "150px";
        jumpButton.height = "40px";
        jumpButton.color = "white";
        jumpButton.background = "green";

        // ボタンの位置を調整
        jumpButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        jumpButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        jumpButton.left = "-20px"; // 右から20pxの位置
        jumpButton.top = "-20px"; // 下から20pxの位置

        
        let jumpVelocity = 0; // ジャンプの速度

        jumpButton.onPointerUpObservable.add(() => {
            console.log("Jump button pressed");
            if (!isJumping) {
                isJumping = true;
                jumpVelocity = jumpSpeed; // ジャンプを開始する際の速度を設定
            }
        });

        // レンダーループ内で重力を適用する処理
        scene.registerBeforeRender(() => {
            // 重力を適用
            if (isJumping) {
                camera.position.y += jumpVelocity; // 現在のY座標にジャンプ速度を加算
                jumpVelocity -= 0.03; // ジャンプ速度を徐々に減少させる（重力を模倣）
        
                // 最大ジャンプ高さに達したら、ジャンプを終了
                if (camera.position.y <= jumpHeight) {
                    isJumping = false;
                    jumpVelocity = 0; // ジャンプが終わったら速度をリセット
                }
            }

            // 地面に達した場合の処理
            if (camera.position.y < 1) {
                camera.position.y = 1; // 地面の高さに設定
                isJumping = false; // ジャンプ状態を解除
                jumpVelocity = 0; // 速度をリセット
            }


            // ジョイスティックの入力をカメラの方向に合わせて移動させる
            const forward = camera.getFrontPosition(1).subtract(camera.position).normalize();
            const right = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();

            // 移動ベクトルの計算
            const moveVector = forward.scale(-joystickDelta.y).add(right.scale(-joystickDelta.x));
            camera.cameraDirection.x += moveVector.x * camera.speed * engine.getDeltaTime() / 1000;
            camera.cameraDirection.z += moveVector.z * camera.speed * engine.getDeltaTime() / 1000;

            // Apply movement and jump together
            if (isJumping) {
                camera.position.addInPlace(moveVector.scale(camera.speed * engine.getDeltaTime() / 1000));
            }
        });



        /*scene.registerBeforeRender(() => {
            // プレイヤーの移動方向を取得
            let moveDirection = new BABYLON.Vector3.Zero();
            if (joystick.forward) {
                moveDirection.z += 1; // 前進
            }
            if (joystick.backward) {
                moveDirection.z -= 1; // 後退
            }
            if (joystick.left) {
                moveDirection.x -= 1; // 左
            }
            if (joystick.right) {
                moveDirection.x += 1; // 右
            }
            
            // 移動方向を正規化
            moveDirection.normalize();
        
            
        
            // ジョイスティックでのジャンプアクション
            if (joystick.jump && isGrounded() && !isJumping) {
                isJumping = true;
                velocityY = jumpSpeed;  // ジャンプの上昇速度を設定
            }
        
            // ジャンプ中かどうかのチェック
            if (isJumping) {
                velocityY += gravity * scene.getEngine().getDeltaTime() / 1000;  // 重力の影響を受ける
        
                // 移動方向に対してジャンプさせる
                playerMesh.position.addInPlace(moveDirection.scale(scene.getEngine().getDeltaTime()));
                playerMesh.position.y += velocityY * scene.getEngine().getDeltaTime();
        
                // 着地したらジャンプを終了
                if (playerMesh.position.y <= groundLevel) {
                    playerMesh.position.y = groundLevel;
                    isJumping = false;
                }
            }
        });*/


        /*jumpButton.onPointerUpObservable.add(() => {
            console.log("Jump button pressed");
            if (!isJumping) {
                isJumping = true;

                let targetY = camera.position.y + jumpHeight;

                // 上昇
                const jumpInterval = setInterval(() => {
                    if (camera.position.y >= targetY) {
                        clearInterval(jumpInterval);
                        // 上昇が終わったらジャンプ状態解除
                        isJumping = false;
                    } else {
                        camera.position.y += jumpSpeed;  // 上昇
                    }
                }, 16);  // 約60fps
            }
            // カメラをジャンプさせる処理をここに追加
            //camera.position.y += 2; // 2 ユニット上昇
        });*/

        // ボタンを GUI に追加
        advancedTexture.addControl(jumpButton);



        // ジャンプ処理 (上昇のみ)
        /*
        function jump() {
            if (!isJumping) {
                isJumping = true;

                let targetY = camera.position.y + jumpHeight;

                // 上昇
                const jumpInterval = setInterval(() => {
                    if (camera.position.y >= targetY) {
                        clearInterval(jumpInterval);
                        // 上昇が終わったらジャンプ状態解除
                        isJumping = false;
                    } else {
                        camera.position.y += jumpSpeed;  // 上昇
                    }
                }, 16);  // 約60fps
            }
        }*/

        // GUIの設定 (ジャンプボタン作成)
        /*const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const jumpButton = new BABYLON.GUI.Button.CreateSimpleButton("jumpButton", "Jump");
        jumpButton.width = "150px";
        jumpButton.height = "60px";
        jumpButton.color = "white";
        jumpButton.background = "green";
        jumpButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        jumpButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        jumpButton.top = "-50px";  // 少し画面下から上に
        jumpButton.left = "-20px";  // 少し右側に位置
        advancedTexture.addControl(jumpButton);

        // ジャンプボタンのクリックイベント
        jumpButton.onPointerDownObservable.add(function () {
            jump();
        });*/



        const pointerToKey = new Map();

        // ジョイスティックの作成
        let joystickContainer = document.createElement("div");
        joystickContainer.style.position = "absolute";
        joystickContainer.style.left = "100px";
        joystickContainer.style.bottom = "100px";
        joystickContainer.style.width = "100px";
        joystickContainer.style.height = "100px";
        joystickContainer.style.backgroundColor = "rgba(200, 200, 200, 0.5)";
        joystickContainer.style.borderRadius = "50%";
        document.body.appendChild(joystickContainer);

        let joystickPuck = document.createElement("div");
        joystickPuck.style.position = "absolute";
        joystickPuck.style.left = "40px";
        joystickPuck.style.top = "40px";
        joystickPuck.style.width = "20px";
        joystickPuck.style.height = "20px";
        joystickPuck.style.backgroundColor = "gray";
        joystickPuck.style.borderRadius = "50%";
        joystickContainer.appendChild(joystickPuck);

        let isDraggingJoystick = false;
        let initialTouchPoint = { x: 0, y: 0 };
        let joystickDelta = { x: 0, y: 0 };

        // ジョイスティックの操作
        joystickContainer.addEventListener("pointerdown", (event) => {
            isDraggingJoystick = true;
            initialTouchPoint = { x: event.clientX, y: event.clientY };
            event.preventDefault(); // イベントのデフォルト動作を防止
        });
        

        // タッチイベント用の移動処理
        joystickContainer.addEventListener("touchmove", (event) => {
            if (isDraggingJoystick) {
                const touch = event.touches[0]; // 最初のタッチを取得
                let deltaX = touch.clientX - initialTouchPoint.x;
                let deltaY = touch.clientY - initialTouchPoint.y;
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let maxDistance = 50;

                // 距離制限を考慮
                if (distance > maxDistance) {
                    let angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                joystickPuck.style.left = `${50 + deltaX}px`;
                joystickPuck.style.top = `${50 + deltaY}px`;

                joystickDelta.x = deltaX / maxDistance;
                joystickDelta.y = deltaY / maxDistance;

                event.preventDefault(); // イベントのデフォルト動作を防止
            }
        });

        joystickContainer.addEventListener("touchend", () => {
            isDraggingJoystick = false;
            joystickPuck.style.left = "50px";
            joystickPuck.style.top = "50px";
            joystickDelta = { x: 0, y: 0 };
        });

        


        // ジョイスティックの移動
        joystickContainer.addEventListener("pointermove", (event) => {
            if (isDraggingJoystick) {
                let deltaX = event.clientX - initialTouchPoint.x;
                let deltaY = event.clientY - initialTouchPoint.y;
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let maxDistance = 50;  // ジョイスティックの最大距離

                // 最大距離を超えた場合は、その方向に制限
                /*if (distance > maxDistance) {
                    let angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }*/

                // 距離が最大を超えた場合でも、方向の更新は継続する
                let angle = Math.atan2(deltaY, deltaX);
                if (distance > maxDistance) {
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                // ジョイスティックの位置を更新
                joystickPuck.style.left = `${50 + deltaX}px`;
                joystickPuck.style.top = `${50 + deltaY}px`;

                // ジョイスティックの状態を更新
                joystickDelta.x = deltaX / maxDistance;
                joystickDelta.y = deltaY / maxDistance;

                // 移動方向の調整
                updateMovementDirection(joystickDelta);
            }
        });


        /*joystickContainer.addEventListener("pointermove", (event) => {
            if (isDraggingJoystick) {
                let deltaX = event.clientX - initialTouchPoint.x;
                let deltaY = event.clientY - initialTouchPoint.y;
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let maxDistance = 50;  // ジョイスティックの最大距離

                if (distance > maxDistance) {
                    let angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                joystickPuck.style.left = `${50 + deltaX}px`;
                joystickPuck.style.top = `${50 + deltaY}px`;

                joystickDelta.x = deltaX / maxDistance;
                joystickDelta.y = deltaY / maxDistance;
            }
        });*/

        joystickContainer.addEventListener("pointerup", () => {
            isDraggingJoystick = false;
            joystickPuck.style.left = "50px";
            joystickPuck.style.top = "50px";
            joystickDelta = { x: 0, y: 0 };
        });

        // カメラの方向転換
        let isRotatingCamera = false;
        let previousPointerPosition = { x: 0, y: 0 };

        canvas.addEventListener("pointerdown", (event) => {
            if (event.clientX > canvas.width / 2) {  // ジョイスティックのエリア以外でカメラ操作
                isRotatingCamera = true;
                previousPointerPosition = { x: event.clientX, y: event.clientY };
            }
        });

        canvas.addEventListener("pointermove", (event) => {
            if (isRotatingCamera) {
                let deltaX = event.clientX - previousPointerPosition.x;
                let deltaY = event.clientY - previousPointerPosition.y;

                camera.rotation.y += deltaX * 0.002;
                camera.rotation.x += deltaY * 0.002;

                previousPointerPosition = { x: event.clientX, y: event.clientY };
            }
        });

        canvas.addEventListener("pointerup", () => {
            isRotatingCamera = false;
            console.log("pointer up");
        });

        // ジョイスティックの入力をカメラの方向に合わせて移動させる
        scene.registerBeforeRender(() => {
            // カメラの方向に基づいた移動ベクトルを計算
            const forward = camera.getFrontPosition(1).subtract(camera.position).normalize();
            const right = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();

            // 移動ベクトルの計算
            const moveVector = forward.scale(-joystickDelta.y).add(right.scale(-joystickDelta.x));

            camera.cameraDirection.x += moveVector.x * camera.speed * engine.getDeltaTime() / 1000;
            camera.cameraDirection.z += moveVector.z * camera.speed * engine.getDeltaTime() / 1000;
            
        });


        // stopJoystick 関数の改善
        const stopJoystick = () => {
            if (isDraggingJoystick) {
                isDraggingJoystick = false;
                joystickPuck.style.left = "50px";
                joystickPuck.style.top = "50px";
                joystickDelta = { x: 0, y: 0 };
                console.log("Pointer up - Joystick stop");
            }
        };

        //document.addEventListener("pointerup", stopJoystick);
        //window.addEventListener("pointerup", stopJoystick);  // キャンバス外でも動作するように

        // タッチイベントに対応するために追加（モバイル対応）
        //document.addEventListener("touchend", stopJoystick);
        //window.addEventListener("touchend", stopJoystick);

        joystickContainer.addEventListener("touchend", stopJoystick);

        // Debugging logs
        document.addEventListener("pointerup", (e) => console.log("Pointer up - Document", e));
        //window.addEventListener("pointerup", (e) => console.log("Pointer up - Window", e));
        document.addEventListener("touchend", (e) => console.log("Touch end - Document", e));
        //window.addEventListener("touchend", (e) => console.log("Touch end - Window", e));

        // ジョイスティック操作時の pointerup イベント処理
        joystickContainer.addEventListener("pointerup", (e) => {
            console.log("Pointer up - Joystick area", e);
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
