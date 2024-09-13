import * as THREE from "three";

const middlePos = new THREE.Vector3(0, 0, 0);

function getBody(RAPIER, world) {
    const size = 1;
    const range = 6;
    const density = size * 1.0;
    let x = Math.random() * range - range / 2;
    let y = Math.random() * range - range / 2 + 3;
    let z = Math.random() * range - range / 2;

    // physics 
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x, y, z)
    let rigidBody = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(size, size, size);
    world.createCollider(colliderDesc, rigidBody);

    // visual
    const geometry = new THREE.IcosahedronGeometry(5, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
    });
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x00dd00,
        wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    mesh.add(wireMesh);

    // update function to be called every frame
    function update() {
        rigidBody.resetForces(true); // reset forces to zero
        let { x, y, z } = rigidBody.translation(); // get the current position of the rigid body
        let pos = new THREE.Vector3(x, y, z); // create a vector with the current position
        let dir = pos.clone().sub(middlePos).normalize(); // calculate the direction vector from the current position to the middle position
        rigidBody.addForce(dir.multiplyScalar(-0.5), true); // apply a force to the rigid body in the direction of the middle position

        mesh.position.set(x, y, z); // update the position of the mesh to the current position of the rigid body
    }

    return { rigidBody, mesh, update };
}

function getMouseBall(RAPIER, world) {
    const mouseSize = 0.25
    const geometry = new THREE.IcosahedronGeometry(mouseSize, 8);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
    });
    const mouseLight = new THREE.PointLight(0xffffff, 1);
    const mouseMesh = new THREE.Mesh(geometry, material);
    mouseMesh.add(mouseLight);

    // RIGID body 
    let rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0);
    let rigidBody = world.createRigidBody(rigidBodyDesc);
    let dynamicCollider = RAPIER.ColliderDesc.ball(mouseSize * 3.0);
    world.createCollider(dynamicCollider, rigidBody);

    // update function to be called every frame
    function update() {
        let { x, y, z } = rigidBody.translation();
        mouseMesh.position.set(x, y, z);
    }

    return { mesh: mouseMesh, update };
}

export { getBody, getMouseBall };
