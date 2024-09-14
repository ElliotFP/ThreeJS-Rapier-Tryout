import * as THREE from 'three';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';

import { getMouseBall, getBody } from './getBodies.js';
import { getFloor } from './floor.js';
console.log("getBodies imported");
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const width = window.innerWidth;
const height = window.innerHeight;

// setting up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

let mousePos = new THREE.Vector2();


await RAPIER.init();
console.log("RAPIER initialized");
const gravity = { x: 0.0, y: 0.0, z: 0.0 };
const world = new RAPIER.World(gravity);

const fov = 75;
const aspect = width / height;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const scene = new THREE.Scene();

// Add Axes Helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Add Grid Helper
const gridHelper = new THREE.GridHelper(1000, 1000);
scene.add(gridHelper);

// post-processing
const renderScene = new RenderPass(scene, camera);
// resolution, strength, radius, threshold
const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.0, 0.0, 0.005);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const { mesh: floor, physics: floor_physics } = getFloor(RAPIER, world);
scene.add(floor);

const numBodies = 10;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
    const body = getBody(RAPIER, world);
    bodies.push(body);
    scene.add(body.mesh);
}

const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
hemiLight.intensity = 0.2;
scene.add(hemiLight);

// Add Ambient Light for better illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

function animate() {
    requestAnimationFrame(animate);
    world.step();
    mouseBall.update(mousePos);
    bodies.forEach(b => b.update());
    composer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

function handleMouseMove(evt) {
    mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
console.log(scene.children);
window.addEventListener('mousemove', handleMouseMove, false);