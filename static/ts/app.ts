// app.ts

import {createTerrain, TerrainParams} from './terrain'
import {createVegetation, VegetationOptions} from './veg'
import {detectWebGL} from './utils'
import {Loader, Assets} from './asset_loader'

interface VegCovers {
	[id:string] : THREE.Mesh
}

interface VegParams {		// THIS INTERFACE IS SUBJECT TO CHANGE
	"Basin Big Sagebrush Upland"?: 				number, 
	"Curleaf Mountain Mahogany"?: 				number, 
	"Low Sagebrush"?: 			  				number, 
	"Montane Sagebrush Upland"?:				number, 
	"Montane Sagebrush Upland With Trees"?: 	number,
	"Western Juniper Woodland & Savannah"?: 	number,
	"Wyoming and Basin Big Sagebrush Upland"?: 	number
}

export default function run(container_id: string, params: VegParams) {

	const vegParams = params

	if (!detectWebGL) {
		alert("Your browser does not support WebGL. Please use a different browser (I.e. Chrome, Firefox).")
		return null
	}

	let masterAssets: Assets
	let terrain: THREE.Mesh

	// setup the THREE scene
	const container = document.getElementById(container_id)
	const scene = new THREE.Scene()
	const renderer = new THREE.WebGLRenderer()
	container.appendChild(renderer.domElement)
	const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, .1, 1000.0)
	
	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.enableKeys = false
	//controls.addEventListener('change', render)
	camera.position.z = 40
	camera.position.y = 100

	// Custom event handlers since we only want to render when something happens
	renderer.domElement.addEventListener('mousedown', animate, false)
	renderer.domElement.addEventListener('mouseup', stopAnimate, false)
	renderer.domElement.addEventListener('mousewheel', onMouseWheel, false)
	renderer.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

	function onMouseWheel() {
		camera.zoom += 1.0
		render()		
	}

	// Load initial assets
	const loader = Loader()
	loader.load({
			text: [
				// terrain
				{name: 'terrain_vert', url: 'static/shader/terrain.vert.glsl'},
				{name: 'terrain_frag', url: 'static/shader/terrain.frag.glsl'},

				// veg
				{name: 'veg_vert', url: 'static/shader/veg.vert.glsl'},
				{name: 'veg_frag', url: 'static/shader/veg.frag.glsl'}
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
				{name: 'grass_material', url: 'static/img/grass/grass_base.tga'},

				// sagebrush
				{name: 'sagebrush_material', url: 'static/img/sagebrush/sagebrush_1.tga'}
			],
			
			geometries: [
				{name: 'grass', url: 'static/json/geometry/grass.json'},
				{name: 'tree', url: 'static/json/geometry/tree.json'},
				{name: 'sagebrush', url: 'static/json/geometry/sagebrush.json'}
			]
		},
		function(loadedAssets: Assets) {
			masterAssets = loadedAssets
		},
		function(progress: number) {
			console.log(progress * 100 + "% loaded...")
		},
		function(error: string) {
			console.log(error)
		}
	)

	let spatialExtent = [-1, -1, -1, -1]	// dummy vars for starting out

	//animate()

	function updateTerrain(extent: number[], updateVeg?: boolean) {
		if (extent.length === 4) {

			// confirm params are different
			if (terrain == undefined || extent[0] != spatialExtent[0] ||
				extent[1] != spatialExtent[1] ||
				extent[2] != spatialExtent[2] ||
				extent[3] != spatialExtent[3]) {

				spatialExtent = extent
				//console.log("Creating new terrain...")
				if (terrain != undefined) {
					scene.remove(terrain)
					for (var key in vegParams) {
						scene.remove(scene.getObjectByName(key))
					}
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

						vertShader: masterAssets.text['terrain_vert'],
						fragShader: masterAssets.text['terrain_frag'],
						data: loadedAssets.statistics['heightmap_stats'],
						heightmap: loadedAssets.textures['heightmap']
					})
					scene.add(terrain)

					// Add our vegcovers
					for (var key in vegParams) {

						scene.add(createVegetation( 
							{
								heightmap: loadedAssets.textures['heightmap'],
								name: key,
								tex: masterAssets.textures['sagebrush_material'],
								geo: masterAssets.geometries['sagebrush'],
								vertShader: masterAssets.text['veg_vert'],
								fragShader: masterAssets.text['veg_frag'],
								disp: 5.0 / 800.0,
								cells: {},
								heightData: loadedAssets.statistics['heightmap_stats'],
								vegData: {maxHeight: 2000.0, minHeight: 1000.0}
							}
						))

					}

					render()

					if (updateVeg) updateVegetation(vegParams)

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

	function updateVegetation(newParams: VegParams) {

		for (var key in newParams) {
			if (vegParams.hasOwnProperty(key)) {
				vegParams[key] = newParams[key]		// update the object to what we want it to be
				const vegCover = scene.getObjectByName(key) as THREE.Mesh
				const vegGeo = vegCover.geometry as THREE.InstancedBufferGeometry
				vegGeo.maxInstancedCount = Math.floor(vegParams[key] / 100 * 5000)	// make this a static function
			}
		}

		render()
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
		updateVegetation: updateVegetation,

		resize: resize,
		// debug 
		scene: scene,
		camera: camera
	}
}

