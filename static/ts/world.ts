// world.ts

import {VegetationCover, VegetationCoverOptions} from './veg'
import {Terrain, TerrainOptions} from './terrain'
import {AssetLoader, Assets, GeometryAsset, TextureAsset, ShaderAsset} from './loader'

export interface VegParams {		// THIS INTERFACE IS SUBJECT TO CHANGE
	"Basin Big Sagebrush Upland": number, 
	"Curleaf Mountain Mahogany": number, 
	"Low Sagebrush": number, 
	"Montane Sagebrush Upland":	number, 
	"Montane Sagebrush Upland With Trees": number,
	"Western Juniper Woodland & Savannah": number,
	"Wyoming and Basin Big Sagebrush Upland": number
}


export class World {

	public scene: THREE.Scene
	public initialized: boolean

	private terrain: Terrain		// public since this might get updated a lot
	private vegetation: VegetationCover[]	// the vegetation won't get updated, since we 
											//	want to maintain the instanced array buffers
	private assetLoader: AssetLoader
	private assets: Assets

	private heightmap: THREE.Texture

	constructor() {
		this.initialized = false

		this.scene = new THREE.Scene()
		this.assetLoader = new AssetLoader()

		// load assets on object creation		
		let assets: Assets

		// Terrain assets
		assets.textures.push({name: 'TerrainGround', path: 'img/ground_grass_dead.jpg'} as TextureAsset)
		assets.vertexShaders.push({name: 'TerrainVert', path: 'shader/terrain.vert.glsl'} as ShaderAsset)
		assets.fragmentShaders.push({name: 'TerrainFrag', path: 'shader/terrain.frag.glsl'} as ShaderAsset)

		// Grass assets	(I.e. one type of vegetation)
		assets.geometries.push({name: 'GrassGeo', path: 'json/grass.json'} as GeometryAsset)
		assets.textures.push({name: 'GrassMaterial', path: 'img/grass/grass_diff.tga'} as TextureAsset)
		assets.vertexShaders.push({name: 'GrassVert', path: 'shader/grass.vert.glsl'} as ShaderAsset)
		assets.fragmentShaders.push({name: 'GrassFrag', path: 'shader/grass.frag.glsl'} as ShaderAsset)

		this.assetLoader.loadAssets(assets)

		this.assets = assets
	}

	initialize() {

		// create objects (1 terrain, n vegtypes)
		
		// create terrain
		let terrainParams: TerrainOptions
		terrainParams.width = 1000
		terrainParams.height = 1000
		terrainParams.widthSegments = 100
		terrainParams.heightSegments = 100



		this.initialized = true
	}

	updateTerrain(hfPath: string) {

		this.assetLoader

	}

	addTerrain(params: TerrainOptions) {


		let terrain = new Terrain(params)

		this.scene.add(terrain)


	}

	updateVegetation(params: VegetationCoverOptions) {

		for (let i = 0; i < this.vegetation.length; i++) {
			if (this.vegetation[i].name === params.name) {

				// update pct cover of vegetation
				this.vegetation[i].pctCover = params.pctCover
				return
			
			}
		}

		// otherwise, create new vegetation type
		let newVegtype = new VegetationCover(params)
		this.vegetation.push(newVegtype)
		this.scene.add(newVegtype.mesh)
	}

}
