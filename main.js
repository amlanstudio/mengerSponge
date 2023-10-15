import * as THREE from 'three';
import { GUI } from 'dat.gui';
import Sponge from './modules/sponge';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controllers
let settings = {
	toggleRotate: true,
	depth: 2,
	'generate': generate,
	pointLight: {
		color: 0xFF0000,
		intensity: 10
	},
	secondaryLight: {
		color:0x0000FF,
		intensity: 5
	},
	backLight: {
		color: 0xFFFFFF,
		intensity: 50
	},
};

// Scene
const sponge = new Sponge();

// Lights
const pLight = new THREE.PointLight(settings.pointLight.color, 10, 5000);
pLight.position.set(0, -0.5, 0);
scene.add(pLight);

const backLight = new THREE.PointLight(settings.backLight.color, 50, 5000);
backLight.position.set(0.3, 0.5, -1);
scene.add(backLight);

const secondaryLight = new THREE.PointLight(settings.secondaryLight.color, 5, 5000);
secondaryLight.position.set(-1, -1.5, 1);
scene.add(secondaryLight);

const aLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(aLight);

// Anchor
sponge.anchor.position.set(0, -0.5, 0);
scene.add(sponge.anchor);

// GUI
const gui = new GUI();
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(sponge.anchor.rotation, 'x', 0, Math.PI * 2);
cubeFolder.add(sponge.anchor.rotation, 'y', 0, Math.PI * 2);
cubeFolder.add(sponge.anchor.rotation, 'z', 0, Math.PI * 2);
cubeFolder.open();
const cameraPositionFolder = gui.addFolder('Camera position');
cameraPositionFolder.add(camera.position, 'z', 0, Math.PI * 2);
cameraPositionFolder.open();
const cameraRotationFolder = gui.addFolder('Camera rotation');
cameraRotationFolder.add(camera.rotation, 'z', 0, Math.PI * 2);
cameraRotationFolder.open();

const lightColorFolder = gui.addFolder('Lights');
const centralLightFolder = lightColorFolder.addFolder('Central light');
centralLightFolder.addColor(settings.pointLight, 'color')
	.onChange((color) => pLight.color.setHex(color));
centralLightFolder.add(settings.pointLight, 'intensity', 1, 50, 1)
	.onChange((value) => pLight.intensity = value);

const secondaryLightFolder = lightColorFolder.addFolder('Secondary light');
secondaryLightFolder.addColor(settings.secondaryLight, 'color')
	.onChange((color) => secondaryLight.color.setHex(color));
secondaryLightFolder.add(settings.secondaryLight, 'intensity', 1, 50, 1)
	.onChange((value) => secondaryLight.intensity = value);

const backLightFolder = lightColorFolder.addFolder('Back light');
backLightFolder.addColor(settings.backLight, 'color')
	.onChange((color) => backLight.color.setHex(color));
backLightFolder.add(settings.backLight, 'intensity', 1, 50, 1)
	.onChange((value) => backLight.intensity = value);
lightColorFolder.open();

const settingsFolder = gui.addFolder('Settings');
settingsFolder.add(settings, 'toggleRotate');
settingsFolder.open();

const generateFolder = gui.addFolder('Generation');
generateFolder.add(settings, 'depth', 1, 5, 1);
generateFolder.add(settings, 'generate');


function generate() {
	// You can change the depth here
	sponge.create(settings.depth);
}

// Position the camera
camera.position.z = 3;

// Create an animation loop
const animate = () => {
	// Rotate the Menger Sponge
	if (settings.toggleRotate) {
		sponge.anchor.rotation.x += 0.01;
		sponge.anchor.rotation.y += 0.01;
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();
