// Loader that provides a dictionary of named assets
// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich;
// Adapted for use by Taylor Mutch, CBI
define("asset_loader", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Create a Loader instance
     */
    function Loader() {
        var isLoading = false;
        var totalToLoad = 0;
        var numLoaded = 0;
        var numFailed = 0;
        var success_cb;
        var progress_cb;
        var error_cb;
        var done_cb;
        var assets = { images: {}, text: {}, textures: {}, geometries: {}, statistics: {} };
        /**
         * Start loading a list of assets
         */
        function load(assetList, success, progress, error, done) {
            success_cb = success;
            progress_cb = progress;
            error_cb = error;
            done_cb = done;
            totalToLoad = 0;
            numLoaded = 0;
            numFailed = 0;
            isLoading = true;
            if (assetList.text) {
                totalToLoad += assetList.text.length;
                for (var i = 0; i < assetList.text.length; ++i)
                    loadText(assetList.text[i]);
            }
            if (assetList.images) {
                totalToLoad += assetList.images.length;
                for (var i = 0; i < assetList.images.length; ++i)
                    loadImage(assetList.images[i]);
            }
            if (assetList.textures) {
                totalToLoad += assetList.textures.length;
                for (var i = 0; i < assetList.textures.length; ++i)
                    loadTexture(assetList.textures[i]);
            }
            if (assetList.geometries) {
                totalToLoad += assetList.geometries.length;
                for (var i = 0; i < assetList.geometries.length; ++i)
                    loadGeometry(assetList.geometries[i]);
            }
            if (assetList.statistics) {
                totalToLoad += assetList.statistics.length;
                for (var i = 0; i < assetList.statistics.length; ++i)
                    loadStatistics(assetList.statistics[i]);
            }
        }
        function loadText(ad) {
            console.log('loading ' + ad.url);
            var req = new XMLHttpRequest();
            req.overrideMimeType('*/*');
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        assets.text[ad.name] = req.responseText;
                        console.log('loaded ' + ad.name);
                        doProgress();
                    }
                    else {
                        doError("Error " + req.status + " loading " + ad.url);
                    }
                }
            };
            req.open('GET', ad.url);
            req.send();
        }
        function loadImage(ad) {
            var img = new Image();
            assets.images[ad.name] = img;
            img.onload = doProgress;
            img.onerror = doError;
            img.src = ad.url;
        }
        function loadTexture(ad) {
            var parts = ad.url.split('.');
            var ext = parts[parts.length - 1];
            if (ext === 'tga') {
                assets.textures[ad.name] = new THREE.TGALoader().load(ad.url, doProgress);
            }
            else {
                assets.textures[ad.name] = new THREE.TextureLoader().load(ad.url, doProgress);
            }
        }
        function loadGeometry(ad) {
            var jsonLoader = new THREE.JSONLoader();
            jsonLoader.load(ad.url, function (geometry, materials) {
                assets.geometries[ad.name] = geometry;
                doProgress();
            }, function (e) { }, // progress
            function (error) {
                doError("Error " + error + "loading " + ad.url);
            }); // failure
        }
        function loadStatistics(ad) {
            if ($) {
                $.getJSON(ad.url)
                    .done(function (response) {
                    assets.statistics[ad.name] = response['data'];
                    doProgress();
                })
                    .fail(function (jqhxr, textStatus, error) {
                    doError('Error ' + error + "loading " + ad.url);
                });
            }
        }
        function doProgress() {
            numLoaded += 1;
            if (progress_cb)
                progress_cb(numLoaded / totalToLoad);
            tryDone();
        }
        function doError(e) {
            if (error_cb)
                error_cb(e);
            numFailed += 1;
            tryDone();
        }
        function tryDone() {
            if (!isLoading)
                return true;
            if (numLoaded + numFailed >= totalToLoad) {
                var ok = !numFailed;
                if (ok && success_cb)
                    success_cb(assets);
                if (done_cb)
                    done_cb(ok);
                isLoading = false;
            }
            return !isLoading;
        }
        /**
         *  Public interface
         */
        return {
            load: load,
            getAssets: function () { return assets; }
        };
    }
    exports.Loader = Loader; // end Loader
});
// terrain.ts
define("terrain", ["require", "exports"], function (require, exports) {
    "use strict";
    var resolution = 50.0;
    var disp = 0.5;
    function createTerrain(params) {
        // get the heightmap based on the extent parameters
        //let srcPath = 'heightmap/' + extent.join('/')
        //let statsPath = srcPath + '/stats'
        //const loader = new AssetLoader()
        //const heightmap = loader.loadTexture(srcPath)
        //let maxHeight: number
        //const mesh = new THREE.Mesh()
        //console.log
        var maxHeight = params.data.dem_max;
        var width = params.data.dem_width;
        var height = params.data.dem_height;
        var heightmap = params.heightmap;
        heightmap.wrapS = heightmap.wrapT = THREE.RepeatWrapping;
        var groundmap = params.groundmap;
        var geo = new THREE.PlaneBufferGeometry(width * resolution, height * resolution, width - 1, height - 1);
        geo.rotateX(-Math.PI / 2);
        var mat = new THREE.ShaderMaterial({
            uniforms: {
                heightmap: { type: "t", value: heightmap },
                maxHeight: { type: "f", value: maxHeight },
                disp: { type: "f", value: disp },
                tex: { type: "t", value: groundmap }
            },
            vertexShader: params.vertShader,
            //vertexShader: loader.loadShader('static/shader/terrain.vert.glsl'),
            fragmentShader: params.fragShader
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'terrain';
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
        return mesh;
        //return //{
        //mesh: mesh,
        //heightmap: heightmap
        //}
    }
    exports.createTerrain = createTerrain;
});
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
define("app", ["require", "exports", "terrain", "asset_loader"], function (require, exports, terrain_1, asset_loader_1) {
    "use strict";
    function run(container_id) {
        var initialized = false;
        var masterAssets;
        var vegcounter = 0;
        var addcounter = 0;
        var terrain;
        var container = document.getElementById(container_id);
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 100000.0);
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.z = 2;
        camera.position.y = 10000;
        container.appendChild(renderer.domElement);
        // load initial assets
        var loader = asset_loader_1.Loader();
        loader.load({
            text: [
                { name: 'terrain.vert', url: 'static/shader/terrain.vert.glsl' },
                { name: 'terrain.frag', url: 'static/shader/terrain.frag.glsl' }
            ],
            textures: [
                { name: 'terrain_ground1', url: 'static/img/terrain/soil.jpg' },
                { name: 'grass_material', url: 'static/img/grass/grass_base.tga' }
            ],
            geometries: [
                { name: 'grass', url: 'static/json/geometry/grass.json' },
                { name: 'tree', url: 'static/json/geometry/tree.json' }
            ]
        }, function (loadedAssets) {
            masterAssets = loadedAssets;
            initialized = true;
        }, function (progress) {
            console.log(progress * 100 + "% loaded...");
        }, function (error) {
            console.log(error);
        });
        var vegetations;
        var spatialExtent = [-1, -1, -1, -1];
        animate();
        function updateTerrain(extent) {
            if (extent.length === 4) {
                // confirm params are different
                //console.log(terrain)
                if (terrain == undefined || extent[0] != spatialExtent[0] ||
                    extent[1] != spatialExtent[1] ||
                    extent[2] != spatialExtent[2] ||
                    extent[3] != spatialExtent[3]) {
                    if (terrain != undefined) {
                        scene.remove(terrain);
                    }
                    var srcPath = 'heightmap/' + extent.join('/');
                    var statsPath = srcPath + '/stats';
                    loader.load({
                        textures: [
                            { name: 'heightmap', url: srcPath }
                        ],
                        statistics: [
                            { name: 'heightmap_stats', url: statsPath }
                        ]
                    }, function (loadedAssets) {
                        terrain = terrain_1.createTerrain({
                            groundmap: masterAssets.textures['terrain_ground1'],
                            vertShader: masterAssets.text['terrain.vert'],
                            fragShader: masterAssets.text['terrain.frag'],
                            data: loadedAssets.statistics['heightmap_stats'],
                            heightmap: loadedAssets.textures['heightmap']
                        });
                        scene.add(terrain);
                    }, function (progress) {
                        console.log("Loading heightmap assets... " + progress * 100 + "%");
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        }
        // for each slider value, we should create vegetation that attaches to it
        function addVegetation(sliderVal) {
            // do nothing for now
            console.log("Add Vegetation Now");
            vegcounter += 1;
            console.log(vegcounter);
        }
        function updateVegetation(data) {
            console.log("Update vegetation now");
            addcounter += 1;
            console.log(addcounter);
            console.log(data);
        }
        function render() {
            renderer.render(scene, camera);
            controls.update();
        }
        var renderID;
        function animate() {
            render();
            renderID = requestAnimationFrame(animate);
        }
        function stopAnimate() {
            cancelAnimationFrame(renderID);
        }
        function resize() {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
        }
        return {
            updateTerrain: updateTerrain,
            addVegetation: addVegetation,
            updateVegetation: updateVegetation,
            animate: animate,
            stopAnimate: stopAnimate,
            scene: scene,
            resize: resize
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=landscape-viewer.js.map