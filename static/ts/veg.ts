// veg.ts

const MAX_INSTANCES = 5000	// the max number of instances we will allow of one vegtype to be drawn

export interface VegetationOptions {

	name: string
	heightmap: THREE.Texture	// heightmap texture
	tex: THREE.Texture			// object texture
	geo: THREE.Geometry			// object geometry
	cells: any					// TODO - define veg cells to determine the position of where to grow vegetation
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

	params.geo.rotateY(Math.PI)
	halfPatch.merge(params.geo)

	const geo = new THREE.InstancedBufferGeometry()
	geo.fromGeometry(halfPatch)
	halfPatch.dispose()

	geo.scale(2,2,2)

	if ( geo.attributes['color'] ) {

		geo.removeAttribute('color')
	
	}

	const cells = params.cells	// todo - what are these cells going to look like?

	const heightmap = params.heightmap
	const widthExtent = params.heightData.dem_width
	const heightExtent = params.heightData.dem_height
	const maxHeight = params.heightData.dem_max

	geo.maxInstancedCount = 0

	const offsets = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2)
	const hCoords = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2)
	
	generateOffsets()
	
	
	geo.addAttribute('offset', offsets)
	geo.addAttribute('hCoord', hCoords)
	const mat = new THREE.RawShaderMaterial({
		uniforms: {
			heightmap: {type: "t", value: heightmap},
			tex: {type: "t", value: params.tex},
			maxHeight: {type: "f", value: maxHeight},
			disp: {type: "f", value: params.disp},

			vegMaxHeight: {type: "f", value: params.vegData.maxHeight},
			vegMinHeight: {type: "f", value: params.vegData.minHeight}
		},
		vertexShader: params.vertShader,
		fragmentShader: params.fragShader,
		side: THREE.DoubleSide
	})

	const mesh = new THREE.Mesh(geo, mat)
	mesh.frustumCulled = false	// Prevents the veg from disappearing randomly
	mesh.name = params.name		// Make the mesh selectable directly from the scene

	function generateOffsets(cells?: any) {
	
		let x: number, y:number, tx:number, ty:number
		let width = widthExtent, height = heightExtent
	
		for (let i = 0; i < offsets.count; i++) {
	
			// position in the spatial extent
			x = Math.random() * width - width / 2
			y = Math.random() * height - height /2
			
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
