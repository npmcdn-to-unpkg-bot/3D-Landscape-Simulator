// terrain.ts

interface TerrainParams {

	// heightmap
	heightmap: THREE.Texture
	heights: Float32Array
	disp: number

	// textures
	rock: THREE.Texture
	snow: THREE.Texture
	grass: THREE.Texture
	sand: THREE.Texture
	water: THREE.Texture

	// shaders
	vertShader: string
	fragShader: string
	data: any

}

export function createTerrain(params: TerrainParams) {

	// data for landscape width/height
	const maxHeight = params.data.dem_max
	const width = params.data.dem_width
	const height = params.data.dem_height

	const terrain_light_position = [1.0, 3.0, -1.0]	// light position for the terrain, i.e. the ball in the sky
													// shines from the top and slightly behind and west

	// make sure the textures repeat wrap
	params.heightmap.wrapS = params.heightmap.wrapT = THREE.RepeatWrapping
	params.rock.wrapS = params.rock.wrapT = THREE.RepeatWrapping
	params.grass.wrapS = params.grass.wrapT = THREE.RepeatWrapping
	params.snow.wrapS = params.snow.wrapT = THREE.RepeatWrapping
	params.sand.wrapS = params.sand.wrapT = THREE.RepeatWrapping
	params.water.wrapS = params.water.wrapT = THREE.RepeatWrapping

	const geo = new THREE.PlaneBufferGeometry(width, height, width-1, height-1)
	geo.rotateX(-Math.PI / 2)

	let vertices = geo.getAttribute('position')

	for (var i = 0; i < vertices.count; i++) {
		vertices.setY(i, params.heights[i] * params.disp)
	}

	geo.computeVertexNormals()

	const mat = new THREE.ShaderMaterial({
		uniforms: {
				heightmap: {type: "t", value: params.heightmap},
				rock: {type: "t", value: params.rock},
				snow: {type: "t", value: params.snow},
				grass: {type: "t", value: params.grass},
				sand: {type: "t", value: params.sand},
				light_position: {type: "3f", value: terrain_light_position}
			},
		vertexShader: params.vertShader,
		fragmentShader: params.fragShader
	})

	const mesh = new THREE.Mesh(geo, mat)
	mesh.name = 'terrain'

	// never reuse
	geo.dispose()
	mat.dispose()

	return mesh
}