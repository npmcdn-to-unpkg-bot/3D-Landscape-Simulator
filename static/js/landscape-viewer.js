var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// veg.ts
define("veg", ["require", "exports"], function (require, exports) {
    "use strict";
    var MAX_INSTANCES = 5000; // the max number of instances we will allow of one vegtype to be drawn
    /**
        Create a THREE object that exposes:
            - Mesh
            - MaxInstancedCount
            - HeightTexture
    */
    var VegetationCover = (function () {
        function VegetationCover(params) {
            this.geo = new THREE.InstancedBufferGeometry();
            this.geo.fromGeometry(params.geo);
            if (this.geo.attributes['color']) {
                this.geo.removeAttribute('color');
            }
            this.cells = params.cells; // todo - what are these cells going to look like?
            this.heightmap = params.heightmap;
            this.pctCover = params.pctCover;
            this.widthExtent = params.patchDimensions.x;
            this.heightExtent = params.patchDimensions.y;
            this.minHeight = params.patchDimensions.z;
            this.maxHeight = params.patchDimensions.w;
            // The main thing we need to update
            this.geo.maxInstancedCount = Math.floor(this.pctCover * MAX_INSTANCES);
            // create the uniforms and allocate shaders for this vegtype
            this.colorMap = params.tex;
            this.offsets = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2);
            this.hCoords = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2);
            this.generateOffsets();
            this.geo.addAttribute('offset', this.offsets);
            this.geo.addAttribute('hCoord', this.hCoords);
            this.mat = new THREE.RawShaderMaterial({
                uniforms: {
                    heightmap: { type: "t", value: this.heightmap },
                    tex: { type: "t", value: this.colorMap },
                    minHeight: { type: "f", value: this.minHeight },
                    maxHeight: { type: "f", value: this.maxHeight }
                },
                vertexShader: params.vertShader,
                fragmentShader: params.fragShader,
                side: THREE.DoubleSide
            });
            this.mesh = new THREE.Mesh(this.geo, this.mat); // this what we want to access initially on initializing the world
        }
        VegetationCover.prototype.generateOffsets = function (cells) {
            if (cells !== undefined) {
                this.cells = cells;
            }
            var x, y, tx, ty;
            var width = this.widthExtent, height = this.heightExtent;
            for (var i = 0; i < this.offsets.count; i++) {
                // position in the spatial extent
                x = Math.random() * width - width / 2;
                y = Math.random() * height - height / 2;
                // position in the heightmap
                tx = x / width + 0.5;
                ty = y / height + 0.5;
                // update attribute buffers
                this.offsets.setXY(i, x, y);
                this.hCoords.setXY(i, tx, 1 - ty); // 1-ty since texture is flipped on Y axis
            }
        };
        return VegetationCover;
    }());
    exports.VegetationCover = VegetationCover;
});
// terrain.ts
define("terrain", ["require", "exports"], function (require, exports) {
    "use strict";
    var Terrain = (function (_super) {
        __extends(Terrain, _super);
        function Terrain(params) {
            var geo = new THREE.PlaneBufferGeometry(params.width, params.height, params.widthSegments, params.heightSegments);
            var mat = new THREE.ShaderMaterial({
                uniforms: {
                    heightmap: { type: "t", value: params.heightmap },
                    maxHeight: { type: "f", value: params.maxHeight },
                    minHeight: { type: "f", value: params.minHeight },
                    disp: { type: "f", value: params.heightDisp },
                    tex: { type: "t", value: params.groundmap }
                },
                vertexShader: params.vertShader,
                fragmentShader: params.fragShader
            });
            _super.call(this, geo, mat); // create the mesh super class
            this.name = 'terrain';
            this.heightmap = mat.uniforms.heightmap.value;
        }
        Terrain.prototype.dispose = function () {
            this.geometry.dispose();
            this.material.dispose();
            this.heightmap.dispose();
        };
        return Terrain;
    }(THREE.Mesh));
    exports.Terrain = Terrain;
});
// loader.ts
define("loader", ["require", "exports"], function (require, exports) {
    "use strict";
    var AssetLoader = (function () {
        function AssetLoader() {
            this.jsonLoader = new THREE.JSONLoader();
            this.TGALoader = new THREE.TGALoader();
            this.textureLoader = new THREE.TextureLoader();
        }
        AssetLoader.prototype.loadTexture = function (path) {
            var parts = path.split('.');
            var ext = parts[parts.length - 1];
            var texture;
            if (ext === 'tga') {
                this.TGALoader.load(path, function (texture) {
                    texture = texture;
                });
            }
            else {
                this.textureLoader.load(path, function (texture) {
                    texture = texture;
                });
            }
            return texture;
        };
        AssetLoader.prototype.loadGeometry = function (path) {
            var geo;
            this.jsonLoader.load(path, function (geometry, materials) {
                //return {
                //geo: geometry,
                //materials: materials
                //}
                geo = geometry;
            });
            return geo;
        };
        AssetLoader.prototype.loadShader = function (path) {
            var shaderText;
            var req = new XMLHttpRequest();
            req.overrideMimeType('*/*');
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        shaderText = req.responseText;
                    }
                    else {
                        console.log("Error " + req.status + " loading " + path);
                        return "";
                    }
                }
            };
            req.open('GET', path);
            req.send();
            return shaderText;
        };
        AssetLoader.prototype.loadAssets = function (assets) {
            var geo, tex, vs, fs;
            for (geo in assets.geometries) {
                geo.value = this.loadGeometry(geo.path);
            }
            for (tex in assets.textures) {
                tex.value = this.loadTexture(tex.path);
            }
            for (fs in assets.fragmentShaders) {
                fs.value = this.loadShader(fs.path);
            }
            for (vs in assets.vertexShaders) {
                vs.value = this.loadShader(vs.path);
            }
            this.assets = assets;
        };
        return AssetLoader;
    }());
    exports.AssetLoader = AssetLoader;
});
// world.ts
define("world", ["require", "exports", "veg", "terrain", "loader"], function (require, exports, veg_1, terrain_1, loader_1) {
    "use strict";
    var World = (function () {
        function World() {
            this.initialized = false;
            this.scene = new THREE.Scene();
            this.assetLoader = new loader_1.AssetLoader();
            // load assets on object creation		
            var assets;
            // Terrain assets
            assets.textures.push({ name: 'TerrainGround', path: 'img/ground_grass_dead.jpg' });
            assets.vertexShaders.push({ name: 'TerrainVert', path: 'shader/terrain.vert.glsl' });
            assets.fragmentShaders.push({ name: 'TerrainFrag', path: 'shader/terrain.frag.glsl' });
            // Grass assets	(I.e. one type of vegetation)
            assets.geometries.push({ name: 'GrassGeo', path: 'json/grass.json' });
            assets.textures.push({ name: 'GrassMaterial', path: 'img/grass/grass_diff.tga' });
            assets.vertexShaders.push({ name: 'GrassVert', path: 'shader/grass.vert.glsl' });
            assets.fragmentShaders.push({ name: 'GrassFrag', path: 'shader/grass.frag.glsl' });
            this.assetLoader.loadAssets(assets);
            this.assets = assets;
        }
        World.prototype.initialize = function () {
            // create objects (1 terrain, n vegtypes)
            // create terrain
            var terrainParams;
            terrainParams.width = 1000;
            terrainParams.height = 1000;
            terrainParams.widthSegments = 100;
            terrainParams.heightSegments = 100;
            this.initialized = true;
        };
        World.prototype.updateTerrain = function (hfPath) {
            this.assetLoader;
        };
        World.prototype.addTerrain = function (params) {
            var terrain = new terrain_1.Terrain(params);
            this.scene.add(terrain);
        };
        World.prototype.updateVegetation = function (params) {
            for (var i = 0; i < this.vegetation.length; i++) {
                if (this.vegetation[i].name === params.name) {
                    // update pct cover of vegetation
                    this.vegetation[i].pctCover = params.pctCover;
                    return;
                }
            }
            // otherwise, create new vegetation type
            var newVegtype = new veg_1.VegetationCover(params);
            this.vegetation.push(newVegtype);
            this.scene.add(newVegtype.mesh);
        };
        return World;
    }());
    exports.World = World;
});
// utils.ts
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    function $e(id) {
        return document.getElementById(id);
    }
    exports.$e = $e;
    function $i(id) {
        return document.getElementById(id);
    }
    exports.$i = $i;
    function detectWebGL() {
        try {
            var canvas = document.createElement('canvas');
            return !!window['WebGLRenderingContext'] &&
                (!!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl'));
        }
        catch (e) {
            return null;
        }
    }
    exports.detectWebGL = detectWebGL;
});
// app.ts
define("app", ["require", "exports", "world"], function (require, exports, world_1) {
    "use strict";
    var App = (function () {
        function App(container) {
            //if detectWebGL()	// detect whether webgl will run on this platform
            // Create the renderer, don't initialize yes
            this.container = container;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
            this.container.appendChild(this.renderer.domElement);
            document.addEventListener('resize', this.resizeRenderer, false);
            this.world = new world_1.World();
            this.camera = new THREE.PerspectiveCamera();
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        }
        // run boo
        App.prototype.updateWebGL = function (hmPath, initialConditions) {
            this.world.initialize();
            // initial conditions
            //this.updateHeightmap(hmPath)
            this.currentParams = initialConditions;
            //this.updateVegetationCovers(this.currentParams)
            // start rendering
            this.animate();
        };
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
        App.prototype.render = function () {
            this.controls.update();
            this.renderer.render(this.world.scene, this.camera);
        };
        App.prototype.animate = function () {
            this.render();
            requestAnimationFrame(this.animate);
        };
        App.prototype.resizeRenderer = function () {
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
            this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
            this.camera.updateProjectionMatrix();
        };
        return App;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = App;
});
// then we need the app to construct the world without rendering anything
// after world is ready, we need to wait for the user to select a county so 
// that we can collect a heightmap and initialize the webgl sequence 
//# sourceMappingURL=landscape-viewer.js.map