import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


class Sponge {
	constructor() {
		this.anchor = new THREE.Object3D();
	}

	/**
	 * Defines the recursive function to create the Menger Sponge.
	 * @param {THREE.BufferGeometry[]} geometries : List of geometries of this sponge
	 * @param {THREE.Vector3} position : Position of the cube relative to the anchor
	 * @param {float} size : Size of the drawn cube
	 * @param {int} depth : recursive depth of the Menger's Sponge
	 * @param {int} currentIteration
	 */
	#create(geometries, position, size, depth, currentIteration = 0) {
		if (currentIteration == depth) {
			// This shit is maybe optimized mesh.
			// https://threejs.org/manual/#en/optimize-lots-of-objects
			const initialGeometry = new THREE.BoxGeometry(size, size, size);
			// let positionHelper = new THREE.Object3D();
			// positionHelper.add(this.anchor);

			// // positionHelper.position.copy(position);
			// this.anchor.updateWorldMatrix(true, false);
			// initialGeometry.applyMatrix4(this.anchor.matrixWorld);
			//geometries.push(initialGeometry);
			let mesh = new THREE.Mesh(initialGeometry, new THREE.MeshPhongMaterial({color: 0x404040}));
			mesh.position.copy(position);
			this.anchor.add(mesh);
			return;
		}

		const newSize = size / 3.0;
		const vals = [-1, 0, 1]; // For neighbours

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					let offset = Math.abs(vals[i]) + Math.abs(vals[j]) + Math.abs(vals[k]);
					if (offset > 1) {
						this.#create(
							geometries,
							new THREE.Vector3(
								position.x + vals[i] * newSize,
								position.y + vals[j] * newSize,
								position.z + vals[k] * newSize),
							newSize, depth, currentIteration + 1);
					}
					else if (offset == 1) { // Center of a face
						// const geometry = new THREE.SphereGeometry(newSize / 3, 15, 32, 16);
						// const material = new THREE.MeshPhongMaterial({ color: 0x404040 });
						// const sphere = new THREE.Mesh(geometry, material);
						// sphere.position.set(position.x, position.y, position.z);
						// this.anchor.add(sphere);
					} else { // Center of the current cube section
						// const geometry = new THREE.ConeGeometry(newSize / 3, 5, 20, 32);
						// const material = new THREE.MeshPhongMaterial({ color: 0x404040 });
						// const sphere = new THREE.Mesh(geometry, material);
						// sphere.position.set(position.x, position.y, position.z);
						// this.anchor.add(sphere);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @param {number} depth Generation depth
	 */
	create(depth) {
		this.anchor.children = [];
		const geometries = [];
		this.#create(geometries, new THREE.Vector3(), 1, depth);

		// console.log(geometries);

		// let mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);

		// console.log(mergedGeometry);

		// this.anchor.add(
		// 	new THREE.Mesh(
		// 		mergedGeometry,
		// 		new THREE.MeshBasicMaterial({ color: 0x404040 }))
		// );
	}
}

export default Sponge;