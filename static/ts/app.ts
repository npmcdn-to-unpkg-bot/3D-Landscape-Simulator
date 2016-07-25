// app.ts

import {World, VegParams} from './world'
import {detectWebGL} from './utils'


export default class App {

	public initialized: boolean

	// spatial extend
	public top: number		// latitudes
	public bottom: number
	public left: number		// longitudes
	public right: number
	public currentParams: VegParams	// the main thing we need to change overall
	public initialParams: VegParams // the thing we need to compare against to update the vegetation

	// private members
	private world: World
	private renderer: THREE.WebGLRenderer	// the renderer renders the world
	private controls: THREE.OrbitControls	// controls
	private camera: THREE.PerspectiveCamera	// camera for the world
	private container: HTMLDivElement		// container where our rendering happens

	constructor(container: HTMLDivElement) {

		//if detectWebGL()	// detect whether webgl will run on this platform

		// Create the renderer, don't initialize yes
		this.container = container
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
		this.container.appendChild(this.renderer.domElement)
		document.addEventListener('resize', this.resizeRenderer, false)
		
		this.world = new World()
		this.camera = new THREE.PerspectiveCamera()
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
	}

	// run boo
	updateWebGL(hmPath:string, initialConditions: VegParams) {
		
		this.world.initialize()

		// initial conditions
		//this.updateHeightmap(hmPath)
		this.currentParams = initialConditions
		//this.updateVegetationCovers(this.currentParams)

		// start rendering
		this.animate()
	}



	//updateHeightmap(hmPath: string) {
	//	let newHeightmap = this.assetLoader.loadTexture(hmPath)
	//	this.world.terrain.heightmap = newHeightmap
//
	//}
//
	//updateVegetationCovers(params: VegParams) {
	//	// updates each vegetation in the world with a new percent cover
	//	this.world.updateVegetation()
	//}

	render() {
		this.controls.update()
		this.renderer.render(this.world.scene, this.camera)
	}

	animate() {
		this.render()
		requestAnimationFrame(this.animate)
	}

	resizeRenderer() {
		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
		this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight
		this.camera.updateProjectionMatrix()
	}


}


// then we need the app to construct the world without rendering anything



// after world is ready, we need to wait for the user to select a county so 
// that we can collect a heightmap and initialize the webgl sequence