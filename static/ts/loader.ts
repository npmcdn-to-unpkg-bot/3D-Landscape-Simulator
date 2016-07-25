// loader.ts

interface Asset {	// base asset
	name: string
	path: string
}

export interface TextureAsset extends Asset {
	value: THREE.Texture
}

export interface GeometryAsset extends Asset {
	value: THREE.Geometry
}

export interface ShaderAsset extends Asset {
	value: string
}

export interface Assets {
	geometries: GeometryAsset[]
	textures: TextureAsset[]
	vertexShaders: ShaderAsset[]
	fragmentShaders: ShaderAsset[]
}

export class AssetLoader {

	private jsonLoader: THREE.JSONLoader
	private TGALoader: THREE.TGALoader	// TODO - possibly not needed? look in to removing
	private textureLoader: THREE.TextureLoader

	public assets: Assets

	constructor() {
		this.jsonLoader = new THREE.JSONLoader()
		this.TGALoader = new THREE.TGALoader()
		this.textureLoader = new THREE.TextureLoader()
	}

	loadTexture(path: string): THREE.Texture {

		let parts = path.split('.')
		let ext = parts[parts.length - 1]
		let texture: THREE.Texture
		if (ext === 'tga') {

			this.TGALoader.load(path, function(texture) {
				texture = texture
			})
						
		} else {
			this.textureLoader.load(path, function(texture) {
				texture = texture
			})
		}
		return texture
	}

	loadGeometry(path: string): THREE.Geometry {

		let geo: THREE.Geometry

		this.jsonLoader.load(path, function(geometry, materials) {
			//return {
				//geo: geometry,
				//materials: materials
			//}
			geo = geometry
		})

		return geo
	}

	loadShader(path: string): string {

		let shaderText: string

		const req = new XMLHttpRequest()
		req.overrideMimeType('*/*')
		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status === 200) {
					shaderText = req.responseText
					//return req.responseText
				} else {
					console.log("Error "+req.status+" loading "+path)
					return ""
				}
			}
		}
		req.open('GET', path)
		req.send()

		return shaderText
	}

	loadAssets(assets: Assets) {
		let geo: any, tex: any, vs: any, fs: any
		for (geo in assets.geometries) {
			geo.value = this.loadGeometry(geo.path)
		}
		for (tex in assets.textures) {
			tex.value = this.loadTexture(tex.path)
		}
		for (fs in assets.fragmentShaders) {
			fs.value = this.loadShader(fs.path)
		}
		for (vs in assets.vertexShaders) {
			vs.value = this.loadShader(vs.path)
		}

		this.assets = assets
	}

}