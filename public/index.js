import * as THREE from 'three';

const width = window.innerWidth;
const height = window.innerHeight;

console.log(width, height);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = width / height;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;
const scene = new THREE.Scene();

const geometry = new THREE.IcosahedronGeometry(5, 2);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
});

const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
});

const weirdShape = new THREE.Mesh(geometry, material);
const weirdShape2 = new THREE.Mesh(geometry, wireMaterial);
weirdShape.add(weirdShape2);
scene.add(weirdShape);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.2);
scene.add(hemisphereLight);

const animate = () => {
    requestAnimationFrame(animate);
    weirdShape.rotation.x += 0.001;
    weirdShape.rotation.y += 0.001;
    weirdShape.rotation.z += 0.001;
    renderer.render(scene, camera);
};

animate();
