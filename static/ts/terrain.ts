// terrain.ts


export interface TerrainOptions {
	heightmap: THREE.Texture
	groundmap: THREE.Texture
	width: number
	height: number
	widthSegments: number
	heightSegments: number
	maxHeight: number
	minHeight: number
	heightDisp: number
	vertShader: string
	fragShader: string
}


export class Terrain extends THREE.Mesh {

	public heightmap: THREE.Texture

	constructor(params: TerrainOptions) {

		let geo = new THREE.PlaneBufferGeometry(params.width, params.height, params.widthSegments, params.heightSegments)

		let mat = new THREE.ShaderMaterial({
			uniforms: {
				heightmap: {type: "t", value: params.heightmap},
				maxHeight: {type: "f", value: params.maxHeight},
				minHeight: {type: "f", value: params.minHeight},
				disp: {type: "f", value: params.heightDisp},
				tex: {type: "t", value: params.groundmap}
			},
			vertexShader: params.vertShader,
			fragmentShader: params.fragShader
		})

		super(geo, mat)	// create the mesh super class

		this.name = 'terrain'
		this.heightmap = mat.uniforms.heightmap.value

	}

	dispose() {
		this.geometry.dispose()
		this.material.dispose()
		this.heightmap.dispose()
	}


}