// veg.ts
import * as globals from './globals'

export interface Cluster {
	xpos: number
	ypos: number
}

export interface VegetationOptions {

	name: string
	scale: number
	symmetric: boolean
	heightmap: THREE.Texture	// heightmap texture
	tex: THREE.Texture			// object texture
	geo: THREE.Geometry			// object geometry
	color: THREE.Color			// object color to blend with
	clusters: Cluster[]			// locations of sagebrush clusters in the terrain
	vertShader: string			// vertex shader
	fragShader: string			// fragment shader
	disp: number				// vertical scaler
	light_position: number[]	// light position - differs for certain vegetation types
	
	// Data regarding the shape of this vegcover
	heightData: any
	vegData: any
}

export function createVegetation(params: VegetationOptions) {

	const halfPatch = new THREE.Geometry()
	halfPatch.merge(params.geo)
	
	if (params.symmetric) {
		params.geo.rotateY(Math.PI)
		halfPatch.merge(params.geo)
	}

	const geo = new THREE.InstancedBufferGeometry()
	geo.fromGeometry(halfPatch)
	halfPatch.dispose()
	const scale = params.scale
	geo.scale(scale,scale,scale)

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
	
	generateOffsets()
	
	geo.addAttribute('offset', offsets)
	geo.addAttribute('hCoord', hCoords)
	const mat = new THREE.RawShaderMaterial({
		uniforms: {
			heightmap: {type: "t", value: heightmap},
			tex: {type: "t", value: params.tex},
			maxHeight: {type: "f", value: maxHeight},
			disp: {type: "f", value: params.disp},
			vegColor: {type: "3f", value: [params.color.r/255.0, params.color.g/255.0, params.color.b/255.0]},	// implicit vec3 in shaders
			vegMaxHeight: {type: "f", value: params.vegData.maxHeight},
			vegMinHeight: {type: "f", value: params.vegData.minHeight},
			light_position: {type: "3f", value: params.light_position}
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
	
		let x: number, y:number, tx:number, ty:number
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
		}

	}

	return mesh
}
