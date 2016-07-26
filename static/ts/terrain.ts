// terrain.ts

const resolution = 800.0
const disp = 5.0 / resolution

export interface TerrainParams {

	//groundmap: THREE.Texture
	rock: THREE.Texture
	snow: THREE.Texture
	grass: THREE.Texture
	dirt: THREE.Texture
	sand: THREE.Texture
	water: THREE.Texture

	vertShader: string
	fragShader: string
	heightmap: THREE.Texture
	data: any

}

export function createTerrain(params: TerrainParams) {

	// data for landscape width/height
	const maxHeight = params.data.dem_max
	const width = params.data.dem_width
	const height = params.data.dem_height

	// make sure the textures repeat wrap
	params.heightmap.wrapS = params.heightmap.wrapT = THREE.RepeatWrapping
	params.rock.wrapS = params.rock.wrapT = THREE.RepeatWrapping
	params.grass.wrapS = params.grass.wrapT = THREE.RepeatWrapping
	params.dirt.wrapS = params.dirt.wrapT = THREE.RepeatWrapping
	params.snow.wrapS = params.snow.wrapT = THREE.RepeatWrapping
	params.sand.wrapS = params.sand.wrapT = THREE.RepeatWrapping

	const geo = new THREE.PlaneBufferGeometry(width, height, width-1, height-1)
	geo.rotateX(-Math.PI / 2)
	const mat = new THREE.ShaderMaterial({
		uniforms: {
			heightmap: {type: "t", value: params.heightmap},
			maxHeight: {type: "f", value: maxHeight},
			disp: {type: "f", value: disp},
			rock: {type: "t", value: params.rock},
			snow: {type: "t", value: params.snow},
			grass: {type: "t", value: params.grass},
			sand: {type: "t", value: params.sand},
			water: {type: "t", value: params.water}
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