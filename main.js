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
// scene.add(cube);

// Define the recursive function to create the Menger Sponge
function createMengerSponge(posx, posy, posz, size,iterations, current_iteration=0) {
    if (current_iteration==iterations){
        // Define cube
        const initialGeometry = new THREE.BoxGeometry(size,size,size);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff0f });
        const cube = new THREE.Mesh(initialGeometry, material);
        cube.position.set(posx,posy,posz);
        scene.add(cube);
    }else{
        const newSize=size/3.0;
        const neighbores= (-1,0,1);
        let i,j,k;
        for(i in neighbores){
            for(j in neighbores){
                for(k in neighbores){
                    if(abs(i)+abs(j)+abs(k)>1){
                        createMengerSponge(posx+i*newSize,posy+j*newSize,posz+k*newSize,newSize,iterations,current_iteration+1);
                    }
                }
            }
        }

    }
        }
    
        createMengerSponge(0,0,0,1.0,3); // You can change the depth here

        // Position the camera
        camera.position.z = 3;

        // Create an animation loop
        const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the Menger Sponge
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();