// veg.ts

const MAX_INSTANCES = 5000	// the max number of instances we will allow of one vegtype to be drawn

export interface VegetationCoverOptions {

	name: string
	pctCover: number
	heightmap: THREE.Texture		// heightmap texture
	tex: THREE.Texture				// object texture
	geo: THREE.Geometry				// object geometry
	cells: any						// TODO - define veg cells to determine the position of where to grow vegetation
	vertShader: string				// vertex shader
	fragShader: string				// fragment shader
	patchDimensions: THREE.Vector4	// THREE.Vector3(width, height, minHeight, maxHeight)
	verticalDisp: number			// vertical scaler

}

/**
	Create a THREE object that exposes:
		- Mesh
		- MaxInstancedCount
		- HeightTexture
*/
export class VegetationCover {

	public name: string			// the name of the veg type (I.e. "Big Basin Sagebrush", etc.)
	public pctCover: number
	public heightmap: THREE.Texture
	public widthExtent: number
	public heightExtent: number
	public minHeight: number
	public maxHeight: number
	public mesh: THREE.Mesh

	private geo: THREE.InstancedBufferGeometry
	private mat: THREE.RawShaderMaterial
	private cells: any	// todo - determine the size/shape of this, whatever it might be
	private offsets: THREE.InstancedBufferAttribute
	private hCoords: THREE.InstancedBufferAttribute
	private colorMap: THREE.Texture

	constructor(params: VegetationCoverOptions) {
		
		this.geo = new THREE.InstancedBufferGeometry()
		this.geo.fromGeometry(params.geo)

		if ( this.geo.attributes['color'] ) {

			this.geo.removeAttribute('color')
		
		}

		this.cells = params.cells	// todo - what are these cells going to look like?

		this.heightmap = params.heightmap
		this.pctCover = params.pctCover
		this.widthExtent = params.patchDimensions.x
		this.heightExtent = params.patchDimensions.y
		this.minHeight = params.patchDimensions.z
		this.maxHeight = params.patchDimensions.w
		
		// The main thing we need to update
		this.geo.maxInstancedCount = Math.floor(this.pctCover * MAX_INSTANCES)

		// create the uniforms and allocate shaders for this vegtype
		this.colorMap = params.tex

		this.offsets = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2)
		this.hCoords = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2)
		
		this.generateOffsets()
		
		this.geo.addAttribute('offset', this.offsets)
		this.geo.addAttribute('hCoord', this.hCoords)

		this.mat = new THREE.RawShaderMaterial({
			uniforms: {
				heightmap: {type: "t", value: this.heightmap},
				tex: {type: "t", value: this.colorMap},
				minHeight: {type: "f", value: this.minHeight},
				maxHeight: {type: "f", value: this.maxHeight}
			},
			vertexShader: params.vertShader,
			fragmentShader: params.fragShader,
			side: THREE.DoubleSide
		})

		this.mesh = new THREE.Mesh(this.geo, this.mat)	// this what we want to access initially on initializing the world
	}

	generateOffsets(cells?: any) {
		
		if (cells !== undefined) {
			this.cells = cells
		}

		let x: number, y:number, tx:number, ty:number
		let width = this.widthExtent, height = this.heightExtent

		for (let i = 0; i < this.offsets.count; i++) {

			// position in the spatial extent
			x = Math.random() * width - width / 2
			y = Math.random() * height - height /2
			
			// position in the heightmap
			tx = x / width + 0.5
			ty = y / height + 0.5
			
			// update attribute buffers
			this.offsets.setXY(i, x ,y)
			this.hCoords.setXY(i, tx, 1-ty)	// 1-ty since texture is flipped on Y axis
		
		}
	}
}
