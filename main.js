import * as THREE from 'three';

//----------OUR VARIABLES--------
//Width of the Sponge 
// var width=81;

//Depth of recursion (0 is the original cube)
// var last=2;
//--------------------------------

//----------- CREATION OF THE MENGER SPONGE ------------------
//------------------------------------------------------------

//------------------OUR FUNCTIONS -----------------------

// Fonction of Sponge Creation

// Fonction of Render
//--------------------------------------------------------


//-----------RENDERER------------------

//-----------------------------------


//-----------SET UP------------------
//-----------------------------------

//----------- RENDER THE MENGER SPONGE ------------------

//-------------------------------------------------------



// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Anchor
const anchor = new THREE.Object3D();
anchor.position.set(0, -0.5, 0);
scene.add(anchor);
// scene.add(cube);

// Define the recursive function to create the Menger Sponge
function createMengerSponge(x, y, z, size,iterations, current_iteration=0) {
    if (current_iteration==iterations){
        // Define cube
        const initialGeometry = new THREE.BoxGeometry(size,size,size);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff0f });
        const cube = new THREE.Mesh(initialGeometry, material);
        cube.position.set(x,y,z);
        anchor.add(cube);
        return;
    }

    const newSize=size/3.0;
    const values= [-1,0,1]; // For neighbours

    for(let i in values){
        for(let j in values){
            for(let k in values){
                if(Math.abs(values[i])+Math.abs(values[j])+Math.abs(values[k])>1){
                    createMengerSponge(x+values[i]*newSize,y+values[j]*newSize,z+values[k]*newSize,newSize,iterations,current_iteration+1);
                }
            }
        }
    }
}

createMengerSponge(0,0,0,1,1); // You can change the depth here

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