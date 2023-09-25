import * as THREE from 'three';
import { GUI } from 'dat.gui';

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
	}
};

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
const anchor = new THREE.Object3D();
anchor.position.set(0, -0.5, 0);
scene.add(anchor);

// GUI
const gui = new GUI();
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(anchor.rotation, 'x', 0, Math.PI * 2);
cubeFolder.add(anchor.rotation, 'y', 0, Math.PI * 2);
cubeFolder.add(anchor.rotation, 'z', 0, Math.PI * 2);
cubeFolder.open();
const cameraPositionFolder = gui.addFolder('Camera position');
cameraPositionFolder.add(camera.position, 'z', 0, Math.PI * 2);
cameraPositionFolder.open();
const cameraRotationFolder = gui.addFolder('Camera rotation');
cameraRotationFolder.add(camera.rotation, 'z', 0, Math.PI * 2);
cameraRotationFolder.open();
const lightColorFolder = gui.addFolder('Lights');

lightColorFolder.addColor(settings.pointLight, 'color')
	.name('Central light color')
	.onChange((color) => pLight.color.setHex(color));
lightColorFolder.add(settings.pointLight, 'intensity', 1, 50, 1)
	.name('Central light intensity')
	.onChange((value) => pLight.intensity = value);

lightColorFolder.addColor(settings.secondaryLight, 'color')
	.name('Secondary light color')
	.onChange((color) => secondaryLight.color.setHex(color));
lightColorFolder.add(settings.secondaryLight, 'intensity', 1, 50, 1)
	.name('Secondary light intensity')
	.onChange((value) => secondaryLight.intensity = value);

lightColorFolder.addColor(settings.backLight, 'color')
	.name('Back light color')
	.onChange((color) => backLight.color.setHex(color));
lightColorFolder.add(settings.backLight, 'intensity', 1, 50, 1)
	.name('Back light intensity')
	.onChange((value) => backLight.intensity = value);
lightColorFolder.open();
const settingsFolder = gui.addFolder('Settings');
settingsFolder.add(settings, 'toggleRotate');
settingsFolder.open();


/**
 * Defines the recursive function to create the Menger Sponge.
 * @param {THREE.Vector3} position : Position of the cube relative to the anchor
 * @param {float} size : Size of the drawn cube
 * @param {int} depth : recursive depth of the Menger's Sponge
 * @param {int} currentIteration
 */
function createMengerSponge(position, size, depth, currentIteration = 0) {
	if (currentIteration == depth) {
		// Define cube
		const initialGeometry = new THREE.BoxGeometry(size, size, size);
		const material = new THREE.MeshPhongMaterial({ color: 0x404040 });
		const cube = new THREE.Mesh(initialGeometry, material);
		cube.position.set(position.x, position.y, position.z);
		anchor.add(cube);
		return;
	}

	const newSize = size / 3.0;
	const vals = [-1, 0, 1]; // For neighbours

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let k = 0; k < 3; k++) {
				let offset = Math.abs(vals[i]) + Math.abs(vals[j]) + Math.abs(vals[k]);
				if (offset > 1) {
					createMengerSponge(
						new THREE.Vector3(
							position.x + vals[i] * newSize,
							position.y + vals[j] * newSize,
							position.z + vals[k] * newSize),
						newSize, depth, currentIteration + 1);
				}
				else if (offset == 1) { // Center of a face
					const geometry = new THREE.SphereGeometry(newSize / 3, 15, 32, 16);
					const material = new THREE.MeshPhongMaterial({ color: 0x404040 });
					const sphere = new THREE.Mesh(geometry, material);
					sphere.position.set(position.x, position.y, position.z);
					anchor.add(sphere);
				} else { // Center of the current cube section
					const geometry = new THREE.ConeGeometry(newSize / 3, 5, 20, 32);
					const material = new THREE.MeshPhongMaterial({ color: 0x404040 });
					const sphere = new THREE.Mesh(geometry, material);
					sphere.position.set(position.x, position.y, position.z);
					anchor.add(sphere);
				}
			}
		}
	}
}

// You can change the depth here
createMengerSponge(new THREE.Vector3(0, 0, 0), 1, 2);

// Position the camera
camera.position.z = 3;

//Mouse to turn the sponge
let isMovingForward = true;
let z;
const zFinal = 14;

// On click : move the camera forward / backward
window.addEventListener('mousedown', function () {
	isMovingForward = z < zFinal;
	console.log(isMovingForward);
	z = camera.position.z;
});

// Create an animation loop
const animate = () => {
	// Rotate the Menger Sponge
	if (settings.toggleRotate) {
		anchor.rotation.x += 0.01;
		anchor.rotation.y += 0.01;
	}

	if (isMovingForward) {
		z += 0.1;
		if (z < zFinal) {
			camera.position.z = z;
		}
	}
	else {
		z -= 0.1;
		if (z >= 2.5)
			camera.position.z = z;
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();
