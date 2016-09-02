// spatialveg.ts
import * as globals from './globals'

const RESOLUTION = 30	// 30 meter resolution

const AMBIENT = new THREE.Color(globals.WHITE)
const DIFFUSE = new THREE.Color(globals.WHITE)
const SPEC = new THREE.Color(globals.WHITE)
const INTENSITY = 1.0
const KA = 0.63
//const KA = 0.2
const KD = 1.0
const KS = 0.2
const SHINY = 20.0
AMBIENT.multiplyScalar(KA * INTENSITY)
DIFFUSE.multiplyScalar(KD * INTENSITY)
SPEC.multiplyScalar(KS * INTENSITY)

/*
	We should create two types of vegetation
	1) uses the standard 'realism' shaders that the non-spatial version uses, and
	2) one that uses the data-based shaders, to highlight the state class textures that are
	actually being shown, which dictate the change over time.
*/


interface SpatialVegetationParams {
	strataTexture: THREE.Texture,
	stateclassTexture: THREE.Texture,
	heightmap: THREE.Texture,
	vegGeometries: {[id: string]: THREE.Geometry},
	vegTextures: {[id: string]: THREE.Texture},
	vertShader: string,
	fragShader: string,
	data: any,
	heightData: any,
	disp: number,	// possibly unnecessary?
}


interface VegtypeCommonParams {
	geo: THREE.Geometry,
	tex: THREE.Texture,
	width: number,
	height: number,
	vertShader: string,
	fragShader: string,
	vegColor: THREE.Color
}


export function createSpatialVegetation(scene: THREE.Scene, params: SpatialVegetationParams) {
	console.log('Generating vegetation positions...')

	const strata_map = params.strataTexture
	const vegtypes = params.data
	const image = strata_map.image
	let w = image.naturalWidth
	let h = image.naturalHeight
	let canvas = document.createElement('canvas')
	canvas.width = w
	canvas.height = h
	let ctx = canvas.getContext('2d')
	ctx.drawImage(image, 0, 0, w, h)
	let strata_data = ctx.getImageData(0, 0, w, h).data
	const strata_positions = computeStrataPositions(vegtypes, strata_data, w, h)

	let i = 0
	const maxColors = 7
	let baseColor = new THREE.Color(55,80,100)	// TODO - better colors

	for (var name in vegtypes) {
		const assetName = globals.getVegetationAssetsName(name)
		const veg_geo = params.vegGeometries[assetName]
		const veg_tex = params.vegTextures[assetName + '_material']

		const r = Math.floor(i/maxColors * 200)
		const g = Math.floor(i/maxColors * 130)
		i++
		const vegColor = new THREE.Color(baseColor.r + r, baseColor.g + g, baseColor.b)
		const vegtypePositions = computeVegtypePositions(vegtypes[name], strata_positions, strata_data, w, h)
		scene.add(createVegtype(name, params.heightmap, params.stateclassTexture, 
			vegtypePositions.map,  vegtypePositions.numValid, params.heightData, {
				geo: veg_geo,
				tex: veg_tex,
				width: w,
				height: h,
				vertShader: params.vertShader,
				fragShader: params.fragShader,
				vegColor: vegColor
			})
		)
	}
	
	strata_data = ctx = canvas = null

	console.log('Vegetation generated!')
}

function computeStrataPositions(vegtypes: globals.VegParams, data: Uint8ClampedArray, w: number, h: number) {
	let strata_map: boolean[] = new Array()		// declare boolean array
	let strata_data = data.slice()

	// calculate max from strata indices
	let max = 0
	for (var key in vegtypes) {
		max = vegtypes[key] > max ? vegtypes[key] : max
	}

	// scale the indices to max 8bit integer
	for (var i = 0; i < strata_data.length; i++) {
		strata_data[i] = strata_data[i]/max * 255
	}

	// compute the dither
	// Adapted from http://blog.ivank.net/floyd-steinberg-dithering-in-javascript.html
	let idx: number, cc: number, rc: number, err: number
	for (let y = 0; y < h; ++y) {
		for (let x = 0; x < w; ++x) {
			idx = (x + y * w)
			cc = strata_data[idx]
			rc = (cc<128?0:255)
			err = cc-rc
			strata_data[idx] = rc
			if (x+1<w) {
				strata_data[idx+1] += (err*7)>>4 		// right neighbor
			}
			if (y+1==h) {	
				continue	// last line, go back to top
			}
			if (x > 0) {
				strata_data[idx + w - 1] += (err*3)>>4;	// bottom left neighbor
			}
			strata_data[idx + w] += (err*5)>>4			// bottom neighbor
			if (x + 1 < w) {
				strata_data[idx + w + 1] += (err*1)>>4	// bottom right neighbor
			}
		}
	}

	// convert to boolean and return the map
	for (var i = 0; i < strata_data.length; i++) {
		strata_map.push(strata_data[i] == 0? true: false)
	}

	return strata_map
}


function computeVegtypePositions(id: number, position_map: boolean[], type_data: Uint8ClampedArray, w:number, h:number) {
	let vegtype_map: boolean[] = new Array()		// declare boolean array
	let idx : number
	let valid: boolean
	let numValid = 0
	for (let y = 0; y < h; ++y) {
		for (let x = 0; x < w; x++) {

			// idx in the image
			idx = (x + y * w) * 4	// get the r channel only since it's greyscale
			
			// update vegtype map
			valid = type_data[idx] == id && position_map[idx/4]

			// how many are valid? This informs the number of instances to do
			if (valid) numValid++

			vegtype_map.push(valid)
		}
	}
	return {map: vegtype_map, numValid: numValid}
}

function createVegtype(name: string, heightmap: THREE.Texture, init_tex: THREE.Texture, map: boolean[],
	numValid: number, heightData: any, params: VegtypeCommonParams) {

	const halfPatch = new THREE.Geometry()
	halfPatch.merge(params.geo)
	
	if (globals.useSymmetry(name)) {
		params.geo.rotateY(Math.PI)
		halfPatch.merge(params.geo)
	}

	const inst_geo = new THREE.InstancedBufferGeometry()
	inst_geo.fromGeometry(halfPatch)
	halfPatch.dispose()
	const s = globals.getVegetationScale(name)
	inst_geo.scale(s,s,s)

	// always remove the color buffer since we are using textures
	if ( inst_geo.attributes['color'] ) {
		inst_geo.removeAttribute('color')
	}		

	inst_geo.maxInstancedCount = numValid

	const offsets = new THREE.InstancedBufferAttribute(new Float32Array(numValid * 2), 2)
	const hCoords = new THREE.InstancedBufferAttribute(new Float32Array(numValid * 2), 2)
	const rotations = new THREE.InstancedBufferAttribute(new Float32Array(numValid), 1)

	inst_geo.addAttribute('offset', offsets)
	inst_geo.addAttribute('hCoord', hCoords)
	inst_geo.addAttribute('rotation', rotations)

	// generate offsets
	let i = 0
	let x: number, y:number, idx:number, posx: number, posy: number, tx:number, ty: number
	for (y = 0; y < params.height; y++) {
		for (x = 0; x < params.width; x++) {

			idx = (x + y * params.width)

			if (map[idx]) {
				posx = (x - params.width/2)
				posy = (y - params.height/2)
				
				tx = x / params.width
				ty = y / params.height

				offsets.setXY(i, posx, posy)
				hCoords.setXY(i, tx, 1 - ty)
				rotations.setX(i, Math.random() * 2.0)
				i++;
			}
		}
	}
	const maxHeight = heightData.dem_max
	const lightPosition = globals.getVegetationLightPosition(name)
	const diffuseScale = getDiffuseScale(name)
	const vegColor = [params.vegColor.r/255.0, params.vegColor.g/255.0, params.vegColor.b/255.0]

	const mat = new THREE.RawShaderMaterial({
		uniforms: {
			// heights
			heightmap: {type: "t", value: heightmap},
			maxHeight: {type: "f", value: maxHeight},
			disp: {type: "f", value: 2.0 / 30.0},
			// coloring texture
			tex: {type: "t", value: params.tex},
			vegColor: {type: "3f", value: vegColor},	// implicit vec3 in shaders
			// elevation drawing bands - TODO, remove when going to spatial
			//vegMaxHeight: {type: "f", value: 5000.0},
			//vegMinHeight: {type: "f", value: 0.0},
			// lighting
			lightPosition: {type: "3f", value: lightPosition},
			ambientProduct: {type: "c", value: getAmbientProduct(name)},
			diffuseProduct: {type: "c", value: DIFFUSE},
			diffuseScale: {type: "f", value: diffuseScale},
			specularProduct: {type: "c", value: SPEC},
			shininess: {type: "f", value: SHINY}
		},
		vertexShader: params.vertShader,
		fragmentShader: params.fragShader,
		side: THREE.DoubleSide
	})

	const mesh = new THREE.Mesh(inst_geo, mat)
	mesh.name = name
	mesh.renderOrder = globals.getRenderOrder(name)
	mesh.frustumCulled = false

	return mesh

}



function getDiffuseScale(vegname: string) : number {
	if (vegname.includes("Sagebrush")) {
		return 0.7
	}

	return 0.0
}

function getAmbientProduct(vegname: string) : THREE.Color {
	if (vegname.includes("Sagebrush")) {
		return AMBIENT.multiplyScalar(0.2)
	}

	return AMBIENT

}