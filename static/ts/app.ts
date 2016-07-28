// app.ts

import {createTerrain} from './terrain'
import {createVegetation, VegetationOptions, Cluster} from './veg'
import {detectWebGL} from './utils'
import {Loader, Assets} from './asset_loader'

const RESOLUTION = 800.0
const TERRAIN_DISP = 5.0 / RESOLUTION

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
	camera.position.z = 40
	camera.position.y = 100

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

				// sagebrush
				{name: 'sagebrush_material', url: 'static/img/sagebrush/sagebrush_1.tga'}
			],
			
			geometries: [
				{name: 'grass', url: 'static/json/geometry/grass.json'},
				{name: 'tree', url: 'static/json/geometry/tree.json'},
				{name: 'sagebrush', url: 'static/json/geometry/sagebrush.json'}
			]/*,
			statistics: [
				{name: 'vegclass_stats', url: ""}
			]
			*/
		},
		function(loadedAssets: Assets) {
			masterAssets = loadedAssets
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
					rock: masterAssets.textures['terrain_rock'],
					snow: masterAssets.textures['terrain_snow'],
					grass: masterAssets.textures['terrain_grass'],
					sand: masterAssets.textures['terrain_sand'],
					water: masterAssets.textures['terrain_water'],
					vertShader: masterAssets.text['terrain_vert'],
					fragShader: masterAssets.text['terrain_frag'],
					data: loadedAssets.statistics['heightmap_stats'],
					heightmap: loadedAssets.textures['heightmap'],
					disp: TERRAIN_DISP
				})
				scene.add(terrain)

				// compute the heights from this heightmap
				// Only do this once per terrain. We base our clusters off of this

				// TODO - replace values with source in loadedAssets
				const vegclass_stats = {maxHeight: 3100.0, minHeight: 900.0}

				const heightmap = loadedAssets.textures['heightmap']
				const heightmap_stats = loadedAssets.statistics['heightmap_stats']
				const heights = computeHeights(heightmap, heightmap_stats)
				let baseColor = new THREE.Color(55,80,100)	// TODO - better colors
				let i = 0
				const maxColors = 7

				// Add our vegcovers
				for (var key in vegParams) {

					// calculate the veg colors we want to display
					const r = Math.floor(i/maxColors * 200)
					const g = Math.floor(i/maxColors * 130)
					const vegColor = new THREE.Color(baseColor.r + r, baseColor.g + g, baseColor.b)

					scene.add(createVegetation( 
						{
							heightmap: loadedAssets.textures['heightmap'],
							name: key,
							tex: masterAssets.textures['sagebrush_material'],
							geo: masterAssets.geometries['sagebrush'],
							color: vegColor,
							vertShader: masterAssets.text['veg_vert'],
							fragShader: masterAssets.text['veg_frag'],
							disp: TERRAIN_DISP,
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
				// flip vertical because textures are Y+
				idx = (x + (h-y-1) * w) * 4
	
				// scale & store this altitude
				heights[x + y * w] = data[idx] / 255.0 * stats.dem_max
			}
		}
		// Free the resources and return
		data = ctx = canvas = null
		return heights
	}

	function createClusters(heights: Float32Array, hmstats: any, vegstats: any) : Cluster[] {

		const numClusters = Math.floor(Math.random() * 20)

		const finalClusters = new Array()

		const w = hmstats.dem_width
		const h = hmstats.dem_height
		const maxHeight = vegstats.maxHeight
		const minHeight = vegstats.minHeight
		let ix: number, iy: number, height: number
		for (let i = 0; i < numClusters; ++i) {
			ix = Math.floor(Math.random() * w)
			iy = Math.floor(Math.random() * h)
			//console.log(ix, iy, "ix, iy")
			height = heights[ix + iy * w]
			//console.log(height, "height")
			if (height < maxHeight && height > minHeight) { 
				const newCluster = {
					xpos: ix - w/2,
					ypos: iy - h/2,
					radius: Math.random() * 10.0
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

