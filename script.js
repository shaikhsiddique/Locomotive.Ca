import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const container = document.getElementById('canvas-container');
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;
renderer.setSize(containerWidth, containerHeight);
camera.aspect = containerWidth / containerHeight;
camera.updateProjectionMatrix();
renderer.setPixelRatio(window.devicePixelRatio);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let model;
const loader = new GLTFLoader();
loader.load(
  'https://locomotive.ca/assets/3d/ring.compressed.glb',
  function (gltf) {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.scale.set(2, 2, 2);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error);
  }
);

camera.position.z = 5;
camera.position.y = 2;

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

animate();
