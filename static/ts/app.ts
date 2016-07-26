// app.ts

import {createTerrain, TerrainParams} from './terrain'
import {VegetationCover} from './veg'
import {detectWebGL} from './utils'
import {Loader, Assets} from './asset_loader'

interface VegParams {		// THIS INTERFACE IS SUBJECT TO CHANGE
	"Basin Big Sagebrush Upland"?: number, 
	"Curleaf Mountain Mahogany"?: number, 
	"Low Sagebrush"?: number, 
	"Montane Sagebrush Upland"?:	number, 
	"Montane Sagebrush Upland With Trees"?: number,
	"Western Juniper Woodland & Savannah"?: number,
	"Wyoming and Basin Big Sagebrush Upland"?: number
}

export default function run(container_id: string) {

	let initialized = false
	let masterAssets: Assets

	let terrain: THREE.Mesh

	const container = document.getElementById(container_id)
	const scene = new THREE.Scene()
	const renderer = new THREE.WebGLRenderer()
	const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 1000.0)
	const controls = new THREE.OrbitControls(camera, renderer.domElement)

	camera.position.z = 40
	camera.position.y = 100

	container.appendChild(renderer.domElement)

	// load initial assets
	const loader = Loader()
	loader.load({
			text: [
				{name: 'terrain.vert', url: 'static/shader/terrain.vert.glsl'},
				{name: 'terrain.frag', url: 'static/shader/terrain.frag.glsl'}
			],
			
			textures: [
				// terrain materials
				{name: 'terrain_rock', url: 'static/img/terrain/rock-512.jpg'},
				{name: 'terrain_grass', url: 'static/img/terrain/grass-512.jpg'},
				{name: 'terrain_dirt', url: 'static/img/terrain/dirt-512.jpg'},
				{name: 'terrain_snow', url: 'static/img/terrain/snow-512.jpg'},
				{name: 'terrain_sand', url: 'static/img/terrain/sand-512.jpg'},
				{name: 'terrain_water', url: 'static/img/terrain/water-512.jpg'},

				// vegtype materials
				{name: 'grass_material', url: 'static/img/grass/grass_base.tga'}

				// tree materials
			],
			
			geometries: [
				{name: 'grass', url: 'static/json/geometry/grass.json'},
				{name: 'tree', url: 'static/json/geometry/tree.json'}
			]
		},
		function(loadedAssets: Assets) {
			masterAssets = loadedAssets
			initialized = true
		},
		function(progress: number) {
			console.log(progress * 100 + "% loaded...")
		},
		function(error: string) {
			console.log(error)
		}
	)

	let vegetations: VegetationCover[]
	let spatialExtent = [-1, -1, -1, -1]

	animate()

	function updateTerrain(extent: number[]) {
		if (extent.length === 4) {

			// confirm params are different
			if (terrain == undefined || extent[0] != spatialExtent[0] ||
				extent[1] != spatialExtent[1] ||
				extent[2] != spatialExtent[2] ||
				extent[3] != spatialExtent[3]) {

				spatialExtent = extent
				console.log("Creating new terrain...")
				if (terrain != undefined) {
					scene.remove(terrain)
				}

				let srcPath = 'heightmap/' + extent.join('/')
				let statsPath = srcPath + '/stats'
				loader.load({
					textures: [
						{name: 'heightmap', url: srcPath}
					],
					statistics: [
						{name: 'heightmap_stats', url: statsPath}
					]
				},
				function(loadedAssets: Assets) {
					terrain = createTerrain({
						// testing
						rock: masterAssets.textures['terrain_rock'],
						snow: masterAssets.textures['terrain_snow'],
						grass: masterAssets.textures['terrain_grass'],
						dirt: masterAssets.textures['terrain_dirt'],
						sand: masterAssets.textures['terrain_sand'],
						water: masterAssets.textures['terrain_water'],

						vertShader: masterAssets.text['terrain.vert'],
						fragShader: masterAssets.text['terrain.frag'],
						data: loadedAssets.statistics['heightmap_stats'],
						heightmap: loadedAssets.textures['heightmap']
					})
					scene.add(terrain)
				},
				function(progress: number) {
					console.log("Loading heightmap assets... " + progress*100  + "%")
				},
				function(error: string) {
					console.log(error)
				})
			}
		}
	}

	// for each slider value, we should create vegetation that attaches to it
	function addVegetation(sliderVal: number) {
		console.log("Add Vegetation Now")
	}

	function updateVegetation(data: VegParams) {
		console.log("Update vegetation now")
		console.log(data)
	}

	function render() {
		renderer.render(scene, camera)
		controls.update()
	}

	let renderID: any

	function animate() {
		render()
		renderID = requestAnimationFrame(animate)
	}

	function stopAnimate() {
		cancelAnimationFrame(renderID)
	}

	function resize() {
		renderer.setSize(container.offsetWidth, container.offsetHeight)
		camera.aspect = container.offsetWidth / container.offsetHeight
		camera.updateProjectionMatrix()
	}

	return {
		updateTerrain: updateTerrain,
		addVegetation: addVegetation,
		updateVegetation: updateVegetation,
		animate: animate,
		stopAnimate: stopAnimate,
		resize: resize,
		// debug 
		scene: scene,
		camera: camera
	}
}

