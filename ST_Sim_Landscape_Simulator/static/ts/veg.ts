// veg.ts
import * as globals from './globals'

/***** lighting uniforms for vegetation - calculate only once for the whole app *****/
// TODO - add a sun tone to the vegetation? or green specular/emissive?
const AMBIENT = new THREE.Color(globals.WHITE)
const DIFFUSE = new THREE.Color(globals.WHITE)
const SPEC = new THREE.Color(globals.WHITE)
const INTENSITY = 1.0
const KA = 0.63
//const KA = 0.2
const KD = 1.0
const KS = 0.2
const SHINY = 20.0
AMBIENT.multiplyScalar(KA * INTENSITY)
DIFFUSE.multiplyScalar(KD * INTENSITY)
SPEC.multiplyScalar(KS * INTENSITY)

/* Interface */
export interface Cluster {
	xpos: number
	ypos: number
}

export interface VegetationOptions {

	name: string
	heightmap: THREE.Texture	// heightmap texture
	tex: THREE.Texture			// object texture
	geo: THREE.Geometry			// object geometry
	color: THREE.Color			// object color to blend with
	clusters: Cluster[]			// locations of sagebrush clusters in the terrain
	vertShader: string			// vertex shader
	fragShader: string			// fragment shader
	disp: number				// vertical scaler
	
	// Data regarding the shape of this vegcover
	heightData: any
	vegData: any
}

export function createVegetation(params: VegetationOptions) {

	const halfPatch = new THREE.Geometry()
	halfPatch.merge(params.geo)
	
	if (useSymmetry(params.name)) {
		params.geo.rotateY(Math.PI)
		halfPatch.merge(params.geo)
	}

	const geo = new THREE.InstancedBufferGeometry()
	geo.fromGeometry(halfPatch)
	halfPatch.dispose()

	const scale = getVegetationScale(params.name)
	geo.scale(scale,scale,scale)

	// always remove the color buffer since we are using textures
	if ( geo.attributes['color'] ) {

		geo.removeAttribute('color')
	
	}

	const clusters = params.clusters
	const heightmap = params.heightmap
	const widthExtent = params.heightData.dem_width
	const heightExtent = params.heightData.dem_height
	const maxHeight = params.heightData.dem_max
	let numVegInstances: number

	if (globals.USE_RANDOM) {
		numVegInstances = globals.MAX_INSTANCES
	}
	else {
		numVegInstances = Math.floor(globals.MAX_INSTANCES * clusters.length/globals.MAX_CLUSTERS_PER_VEG)
	}

	geo.maxInstancedCount = 0	// must initialize with 0, otherwise THREE throws an error

	const offsets = new THREE.InstancedBufferAttribute(new Float32Array(numVegInstances * 2), 2)
	const hCoords = new THREE.InstancedBufferAttribute(new Float32Array(numVegInstances * 2), 2)
	const rotations = new THREE.InstancedBufferAttribute(new Float32Array(numVegInstances * 1), 1)

	generateOffsets()
	
	const vegColor = [params.color.r/255.0, params.color.g/255.0, params.color.b/255.0]
	const lightPosition = getVegetationLightPosition(params.name)
	const diffuseScale = getDiffuseScale(params.name)

	geo.addAttribute('offset', offsets)
	geo.addAttribute('hCoord', hCoords)
	geo.addAttribute('rotation', rotations)

	const mat = new THREE.RawShaderMaterial({
		uniforms: {
			// heights
			heightmap: {type: "t", value: heightmap},
			maxHeight: {type: "f", value: maxHeight},
			disp: {type: "f", value: params.disp},
			// coloring texture
			tex: {type: "t", value: params.tex},
			vegColor: {type: "3f", value: vegColor},	// implicit vec3 in shaders
			// elevation drawing bands - TODO, remove when going to spatial
			vegMaxHeight: {type: "f", value: params.vegData.maxHeight},
			vegMinHeight: {type: "f", value: params.vegData.minHeight},
			// lighting
			lightPosition: {type: "3f", value: lightPosition},
			ambientProduct: {type: "c", value: getAmbientProduct(params.name)},
			diffuseProduct: {type: "c", value: DIFFUSE},
			diffuseScale: {type: "f", value: diffuseScale},
			specularProduct: {type: "c", value: SPEC},
			shininess: {type: "f", value: SHINY}
		},
		vertexShader: params.vertShader,
		fragmentShader: params.fragShader,
		side: THREE.DoubleSide
	})

	const mesh = new THREE.Mesh(geo, mat)
	mesh.frustumCulled = false	// Prevents the veg from disappearing randomly
	mesh.name = params.name		// Make the mesh selectable directly from the scene
	mesh.userData['numClusters'] = clusters.length

	function generateOffsets(cells?: any) {
	
		let x: number, y:number, tx:number, ty:number, r: number
		let width = widthExtent, height = heightExtent, numClusters = clusters.length
		let cluster: Cluster
		for (let i = 0; i < offsets.count; i++) {

			// determine position in the spatial extent
			if (globals.USE_RANDOM) {
				x = Math.random() * width - width / 2		// random placement
				y = Math.random() * height - height /2
			}
			else {
				cluster = clusters[i % clusters.length]
				x = cluster.xpos + Math.random() * globals.MAX_CLUSTER_RADIUS
				y = cluster.ypos + Math.random() * globals.MAX_CLUSTER_RADIUS

				// adjust if outside bounds
				if (x < -width/2) x = -width/2
				if (x > width/2) x = width/2
				if (y < -height/2) y = -height/2
				if (y > height/2) y = height/2
			}

			// position in the heightmap
			tx = x / width + 0.5
			ty = y / height + 0.5
			
			// update attribute buffers
			offsets.setXY(i, x ,y)
			hCoords.setXY(i, tx, 1-ty)	// 1-ty since texture is flipped on Y axis
			rotations.setX(i, 2 * Math.random())	// set a random rotation factor
		}

	}

	return mesh
}


/****** Vegetation helper functions ******/ 
function useSymmetry(vegname: string) : boolean {
	return  !(vegname.includes('Sagebrush')
			  || vegname.includes('Mahogany') 
			  || vegname.includes('Juniper'))
}

function getDiffuseScale(vegname: string) : number {
	if (vegname.includes("Sagebrush")) {
		return 0.7
	}

	return 0.0
}

function getAmbientProduct(vegname: string) : THREE.Color {
	if (vegname.includes("Sagebrush")) {
		return AMBIENT.multiplyScalar(0.2)
	}

	return AMBIENT

}

function getVegetationScale(vegname: string) : number {
	if (vegname.includes("Sagebrush")) {
		return 10.0
	} else if (vegname.includes("Juniper")) {
		return 1.
	} else if (vegname.includes("Mahogany")) {
		return 15.0
	}
	return 1.0 
}

function getVegetationLightPosition(vegname: string) : number[] {
	if (vegname.includes("Sagebrush")) {
		return [0.0, -5.0, 5.0]
	}
	return [0.0, 5.0, 0.0]
}
