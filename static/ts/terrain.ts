// terrain.ts

import {Loader} from './asset_loader'

const resolution = 50.0
const disp = 0.5

export interface TerrainParams {

	groundmap: THREE.Texture
	vertShader: string
	fragShader: string
	heightmap: THREE.Texture
	data: any

}

export function createTerrain(params: TerrainParams) {

	// get the heightmap based on the extent parameters
	//let srcPath = 'heightmap/' + extent.join('/')
	//let statsPath = srcPath + '/stats'

	//const loader = new AssetLoader()
	//const heightmap = loader.loadTexture(srcPath)
	//let maxHeight: number
	//const mesh = new THREE.Mesh()

	//console.log

	const maxHeight = params.data.dem_max
	const width = params.data.dem_width
	const height = params.data.dem_height

	const heightmap = params.heightmap

	heightmap.wrapS = heightmap.wrapT = THREE.RepeatWrapping

	const groundmap = params.groundmap

	const geo = new THREE.PlaneBufferGeometry(width * resolution, height * resolution, width-1, height-1)
	geo.rotateX(-Math.PI / 2)
	const mat = new THREE.ShaderMaterial({
		uniforms: {
			heightmap: {type: "t", value: heightmap},
			maxHeight: {type: "f", value: maxHeight},
			disp: {type: "f", value: disp},
			tex: {type: "t", value: groundmap}
		},
		vertexShader: params.vertShader,
		//vertexShader: loader.loadShader('static/shader/terrain.vert.glsl'),
		fragmentShader: params.fragShader
		//fragmentShader: loader.loadShader('static/shader/terrain.frag.glsl')
	})

	const mesh = new THREE.Mesh(geo, mat)
	mesh.name = 'terrain'

	//const width = heightmap.image.width
	//const height = heightmap.image.height

	//$.getJSON(statsPath)
	//	.done(function(res) {
	//		maxHeight = res.data.dem_max
	//		const width = res.data.dem_width
	//		const height = res.data.dem_height
	//		let geo = new THREE.PlaneBufferGeometry(width * resolution, height * resolution, width-1, height-1)
	//		let mat = new THREE.ShaderMaterial({
	//			uniforms: {
	//				heightmap: {type: "t", value: heightmap},
	//				maxHeight: {type: "f", value: maxHeight},
	//				disp: {type: "f", value: disp},
	//				tex: {type: "t", value: groundmap}
	//			},
	//			vertexShader: vertShader,
	//			//vertexShader: loader.loadShader('static/shader/terrain.vert.glsl'),
	//			fragmentShader: fragShader
	//			//fragmentShader: loader.loadShader('static/shader/terrain.frag.glsl')
	//		})
//
	//		//mesh = new THREE.Mesh(geo, mat)
	//		mesh.geometry = geo
	//		mesh.material = mat
	//		mesh.name = 'terrain'
	//})

	return mesh

	//return //{
		//mesh: mesh,
		//heightmap: heightmap
	//}

}