// app.ts

import * as globals from './globals'
import {createTerrain} from './terrain'
import {createVegetation, VegetationOptions, Cluster} from './veg'
import {detectWebGL} from './utils'
import {Loader, Assets} from './asset_loader'

//const RESOLUTION = 800.0
//const TERRAIN_DISP = 5.0 / RESOLUTION
//const MAX_NUM_CLUSTERS = 10

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
	let initialized = false

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
	camera.position.z = 40
	camera.position.y = 100
	controls.maxPolarAngle = Math.PI / 2

	// Custom event handlers since we only want to render when something happens.
	renderer.domElement.addEventListener('mousedown', animate, false)
	renderer.domElement.addEventListener('mouseup', stopAnimate, false)
	renderer.domElement.addEventListener('mousewheel', render, false)
	renderer.domElement.addEventListener( 'MozMousePixelScroll', render, false ); // firefox

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
				//{name: 'terrain_dirt', url: 'static/img/terrain/dirt-512.jpg'},
				{name: 'terrain_snow', url: 'static/img/terrain/snow-512.jpg'},
				{name: 'terrain_sand', url: 'static/img/terrain/sand-512.jpg'},
				{name: 'terrain_water', url: 'static/img/terrain/water-512.jpg'},

				// vegtype materials
				{name: 'grass_material', url: 'static/img/grass/grass_base.tga'},
				{name: 'tree_material', url: 'static/img/grass/grass_base.tga'},	// just a base green color
				{name: 'juniper_material', url: 'static/img/juniper/pine-leaf-diff.png'},
				// sagebrush
				{name: 'sagebrush_material', url: 'static/img/sagebrush/sagebrush_1.tga'}
			],
			
			geometries: [
				{name: 'grass', url: 'static/json/geometry/grass.json'},
				{name: 'tree', url: 'static/json/geometry/tree.json'},
				//{name: 'juniper', url: 'static/json/geometry/juniper2.json'},
				{name: 'juniper', url: 'static/json/geometry/tree_simple.json'},
				{name: 'sagebrush', url: 'static/json/geometry/sagebrush_simple.json'}
			]/*,
			statistics: [
				{name: 'vegclass_stats', url: ""}
			]
			*/
		},
		function(loadedAssets: Assets) {
			masterAssets = loadedAssets
			initialized = true
		},
		function(progress: number) {
			console.log("Loading assets... " + progress * 100 + "%")
		},
		function(error: string) {
			console.log(error)
			return
		}
	)

	let spatialExtent = [-1, -1, -1, -1]	// dummy vars for starting out

	function updateTerrain(extent: number[], updateVeg?: boolean) {

		// confirm params are different
		if (extent.length === 4	// extent is exactly 4 long
			&& (terrain == undefined || extent[0] != spatialExtent[0] ||
			extent[1] != spatialExtent[1] ||
			extent[2] != spatialExtent[2] ||
			extent[3] != spatialExtent[3])) {
			spatialExtent = extent
			if (terrain != undefined) {
				scene.remove(terrain)
				terrain.geometry.dispose()
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
				// compute the heights from this heightmap
				// Only do this once per terrain. We base our clusters off of this
				const heightmap = loadedAssets.textures['heightmap']
				const heightmap_stats = loadedAssets.statistics['heightmap_stats']
				const heights = computeHeights(heightmap, heightmap_stats)

				terrain = createTerrain({
					rock: masterAssets.textures['terrain_rock'],
					snow: masterAssets.textures['terrain_snow'],
					grass: masterAssets.textures['terrain_grass'],
					sand: masterAssets.textures['terrain_sand'],
					water: masterAssets.textures['terrain_water'],
					vertShader: masterAssets.text['terrain_vert'],
					fragShader: masterAssets.text['terrain_frag'],
					data: loadedAssets.statistics['heightmap_stats'],
					//heightmap: loadedAssets.textures['heightmap'],
					heightmap: heightmap,
					heights: heights,
					disp: globals.TERRAIN_DISP
				})
				scene.add(terrain)

				// TODO - replace values with source in loadedAssets
				const vegclass_stats = {
					maxHeight: 3100.0,
					minHeight: 900.0
				}

				let baseColor = new THREE.Color(55,80,100)	// TODO - better colors
				let i = 0
				const maxColors = 7

				// Add our vegcovers
				for (var key in vegParams) {

					// calculate the veg colors we want to display
					const r = Math.floor(i/maxColors * 200)
					const g = Math.floor(i/maxColors * 130)
					const vegColor = new THREE.Color(baseColor.r + r, baseColor.g + g, baseColor.b)

					const vegtype = getVegetationType(key)
					const vegscale = getVegetationScale(key)

					scene.add(createVegetation( 
						{
							heightmap: loadedAssets.textures['heightmap'],
							name: key,
							symmetric: useSymmetry(key),
							scale: vegscale,
							tex: masterAssets.textures[vegtype + '_material'],
							geo: masterAssets.geometries[vegtype],
							color: vegColor,
							vertShader: masterAssets.text['veg_vert'],
							fragShader: masterAssets.text['veg_frag'],
							disp: globals.TERRAIN_DISP,
							light_position: getVegetationLightPosition(key),
							clusters: createClusters(heights, heightmap_stats, vegclass_stats),
							heightData: loadedAssets.statistics['heightmap_stats'],
							vegData: vegclass_stats
						}
					))

					++i;
				}
				render()
				if (updateVeg) updateVegetation(vegParams)
			},
			function(progress: number) {
				console.log("Loading heightmap assets... " + progress*100  + "%")
			},
			function(error: string) {
				console.log(error)
				return
			})
		}	
	}

	function computeHeights(hmTexture: THREE.Texture, stats: any) {
		const image = hmTexture.image
		let w = image.naturalWidth
		let h = image.naturalHeight
		let canvas = document.createElement('canvas')
		canvas.width = w
		canvas.height = h
		let ctx = canvas.getContext('2d')
		ctx.drawImage(image, 0, 0, w, h)
		let data = ctx.getImageData(0, 0, w, h).data
		const heights = new Float32Array(w * h)
		let idx: number
		for (let y = 0; y < h; ++y) {
			for (let x = 0; x < w; ++x) {
				// idx pixel we want to get. Image has rgba, but we only need the r channel
				idx = (x + y * w) * 4

				// scale & store this altitude
				heights[x + y * w] = data[idx] / 255.0 * stats.dem_max
			}
		}
		// Free the resources and return
		data = ctx = canvas = null
		return heights
	}

	function useSymmetry(vegname: string) : boolean {
		return  !(vegname.includes('Sagebrush') || vegname.includes('Mahogany') || vegname.includes('Juniper'))
	}

	function getVegetationLightPosition(vegname: string) : number[] {

		if (vegname.includes("Sagebrush")) {
			return [0.0, -5.0, 5.0]
		}

		return [0.0, 5.0, 0.0]

	}

	function getVegetationType(vegname: string) : string {

		if (vegname.includes("Sagebrush")) {
			return 'sagebrush'
		} else if (vegname.includes("Juniper")) {
			return 'juniper'
		}
		else if (vegname.includes("Mahogany")) {
			return 'tree'
		}

		return 'grass' 
	}

	function getVegetationScale(vegname: string) : number {

		if (vegname.includes("Sagebrush")) {
			return 8.0
		} else if (vegname.includes("Juniper")) {
			return 1.
		} else if (vegname.includes("Mahogany")) {
			return 15.0
		}

		return 1.0 
	}

	function createClusters(heights: Float32Array, hmstats: any, vegstats: any) : Cluster[] {

		const numClusters = Math.floor(Math.random() * globals.MAX_CLUSTERS_PER_VEG)

		const finalClusters = new Array()

		const w = hmstats.dem_width
		const h = hmstats.dem_height
		const maxHeight = vegstats.maxHeight
		const minHeight = vegstats.minHeight
		let ix: number, iy: number, height: number
		for (let i = 0; i < numClusters; ++i) {
			ix = Math.floor(Math.random() * w)
			iy = Math.floor(Math.random() * h)
			height = heights[ix + iy * w]
			if (height < maxHeight && height > minHeight) { 
				
				const newCluster = {
					xpos: ix - w/2,
					ypos: iy - h/2,
				} as Cluster

				finalClusters.push(newCluster)
			}
		}

		return finalClusters
	}

	function updateVegetation(newParams: VegParams) {

		for (var key in newParams) {
			if (vegParams.hasOwnProperty(key)) {
				vegParams[key] = newParams[key]		// update the object to what we want it to be
				const vegCover = scene.getObjectByName(key) as THREE.Mesh
				const vegGeo = vegCover.geometry as THREE.InstancedBufferGeometry
				if (globals.USE_RANDOM) {
					vegGeo.maxInstancedCount = Math.floor(vegParams[key] / 100 * globals.MAX_INSTANCES)	// make this a static function
				}
				else {
					const vegClusters = vegCover.userData['numClusters']
					vegGeo.maxInstancedCount = Math.floor(globals.MAX_INSTANCES * (vegParams[key] / 100) * (vegClusters / globals.MAX_CLUSTERS_PER_VEG))
				}
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

	function isInitialized() {
		return initialized
	}

	return {
		updateTerrain: updateTerrain,
		updateVegetation: updateVegetation,
		isInitialized: isInitialized,
		resize: resize,
		// debug 
		scene: scene,
		camera: camera
	}
}

