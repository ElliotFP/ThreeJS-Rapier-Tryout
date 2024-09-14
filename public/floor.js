import * as THREE from 'three';

export function getFloor(RAPIER, world) {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x00bb00, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
    floor.position.set(0, 0, 0);

    const floorShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50); // Half extents
    const floor_physics = world.createCollider(floorShape, { position: { x: 0, y: -0.5, z: 0 } });
    floor_physics.setRestitution(0.5);

    return {
        mesh: floor,
        physics: floor_physics
    };
}