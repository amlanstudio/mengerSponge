import * as THREE from 'three';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Anchor
const anchor = new THREE.Object3D();
anchor.position.set(0, -0.5, 0);
scene.add(anchor);

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
    const material = new THREE.MeshBasicMaterial({color: 0xffff0f});
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
        if (Math.abs(vals[i]) + Math.abs(vals[j]) + Math.abs(vals[k]) > 1) {
          createMengerSponge(
              new THREE.Vector3(
                  position.x + vals[i] * newSize,
                  position.y + vals[j] * newSize,
                  position.z + vals[k] * newSize),
              newSize, depth, currentIteration + 1);
        }
      }
    }
  }
}

// You can change the depth here
createMengerSponge(new THREE.Vector3(0, 0, 0), 1, 2);

// Position the camera
camera.position.z = 3;

// Create an animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the Menger Sponge
  anchor.rotation.x += 0.01;
  anchor.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
