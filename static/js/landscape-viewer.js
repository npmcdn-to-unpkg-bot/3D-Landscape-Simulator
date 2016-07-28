// terrain.ts
define("terrain", ["require", "exports"], function (require, exports) {
    "use strict";
    var resolution = 800.0;
    var disp = 5.0 / resolution;
    function createTerrain(params) {
        // data for landscape width/height
        var maxHeight = params.data.dem_max;
        var width = params.data.dem_width;
        var height = params.data.dem_height;
        // make sure the textures repeat wrap
        params.heightmap.wrapS = params.heightmap.wrapT = THREE.RepeatWrapping;
        params.rock.wrapS = params.rock.wrapT = THREE.RepeatWrapping;
        params.grass.wrapS = params.grass.wrapT = THREE.RepeatWrapping;
        //params.dirt.wrapS = params.dirt.wrapT = THREE.RepeatWrapping
        params.snow.wrapS = params.snow.wrapT = THREE.RepeatWrapping;
        params.sand.wrapS = params.sand.wrapT = THREE.RepeatWrapping;
        params.water.wrapS = params.water.wrapT = THREE.RepeatWrapping;
        var geo = new THREE.PlaneBufferGeometry(width, height, width - 1, height - 1);
        geo.rotateX(-Math.PI / 2);
        var mat = new THREE.ShaderMaterial({
            uniforms: {
                heightmap: { type: "t", value: params.heightmap },
                maxHeight: { type: "f", value: maxHeight },
                disp: { type: "f", value: disp },
                rock: { type: "t", value: params.rock },
                snow: { type: "t", value: params.snow },
                grass: { type: "t", value: params.grass },
                sand: { type: "t", value: params.sand },
                water: { type: "t", value: params.water }
            },
            vertexShader: params.vertShader,
            fragmentShader: params.fragShader
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'terrain';
        // never reuse
        geo.dispose();
        mat.dispose();
        return mesh;
    }
    exports.createTerrain = createTerrain;
});
// veg.ts
define("veg", ["require", "exports"], function (require, exports) {
    "use strict";
    var MAX_INSTANCES = 5000; // the max number of instances we will allow of one vegtype to be drawn
    function createVegetation(params) {
        var halfPatch = new THREE.Geometry();
        halfPatch.merge(params.geo);
        params.geo.rotateY(Math.PI);
        halfPatch.merge(params.geo);
        var geo = new THREE.InstancedBufferGeometry();
        geo.fromGeometry(halfPatch);
        halfPatch.dispose();
        geo.scale(2, 2, 2);
        if (geo.attributes['color']) {
            geo.removeAttribute('color');
        }
        var cells = params.cells; // todo - what are these cells going to look like?
        var heightmap = params.heightmap;
        var widthExtent = params.heightData.dem_width;
        var heightExtent = params.heightData.dem_height;
        var maxHeight = params.heightData.dem_max;
        geo.maxInstancedCount = 0;
        var offsets = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2);
        var hCoords = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 2), 2);
        generateOffsets();
        geo.addAttribute('offset', offsets);
        geo.addAttribute('hCoord', hCoords);
        var mat = new THREE.RawShaderMaterial({
            uniforms: {
                heightmap: { type: "t", value: heightmap },
                tex: { type: "t", value: params.tex },
                maxHeight: { type: "f", value: maxHeight },
                disp: { type: "f", value: params.disp },
                vegColor: { type: "3f", value: [params.color.r / 255.0, params.color.g / 255.0, params.color.b / 255.0] },
                vegMaxHeight: { type: "f", value: params.vegData.maxHeight },
                vegMinHeight: { type: "f", value: params.vegData.minHeight }
            },
            vertexShader: params.vertShader,
            fragmentShader: params.fragShader,
            side: THREE.DoubleSide
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false; // Prevents the veg from disappearing randomly
        mesh.name = params.name; // Make the mesh selectable directly from the scene
        function generateOffsets(cells) {
            var x, y, tx, ty;
            var width = widthExtent, height = heightExtent;
            for (var i = 0; i < offsets.count; i++) {
                // position in the spatial extent
                x = Math.random() * width - width / 2;
                y = Math.random() * height - height / 2;
                // position in the heightmap
                tx = x / width + 0.5;
                ty = y / height + 0.5;
                // update attribute buffers
                offsets.setXY(i, x, y);
                hCoords.setXY(i, tx, 1 - ty); // 1-ty since texture is flipped on Y axis
            }
        }
        return mesh;
    }
    exports.createVegetation = createVegetation;
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
// app.ts
define("app", ["require", "exports", "terrain", "veg", "utils", "asset_loader"], function (require, exports, terrain_1, veg_1, utils_1, asset_loader_1) {
    "use strict";
    function run(container_id, params) {
        var vegParams = params;
        if (!utils_1.detectWebGL) {
            alert("Your browser does not support WebGL. Please use a different browser (I.e. Chrome, Firefox).");
            return null;
        }
        var masterAssets;
        var terrain;
        // setup the THREE scene
        var container = document.getElementById(container_id);
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        container.appendChild(renderer.domElement);
        var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, .1, 1000.0);
        // Camera controls
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableKeys = false;
        camera.position.z = 40;
        camera.position.y = 100;
        // Custom event handlers since we only want to render when something happens.
        //renderer.domElement.addEventListener('mousedown', animate, false)
        //renderer.domElement.addEventListener('mouseup', stopAnimate, false)
        //renderer.domElement.addEventListener('mousewheel', render, false)
        //renderer.domElement.addEventListener( 'MozMousePixelScroll', render, false ); // firefox
        animate(); // debug
        // Load initial assets
        var loader = asset_loader_1.Loader();
        loader.load({
            text: [
                // terrain
                { name: 'terrain_vert', url: 'static/shader/terrain.vert.glsl' },
                { name: 'terrain_frag', url: 'static/shader/terrain.frag.glsl' },
                // veg
                { name: 'veg_vert', url: 'static/shader/veg.vert.glsl' },
                { name: 'veg_frag', url: 'static/shader/veg.frag.glsl' }
            ],
            textures: [
                // terrain materials
                { name: 'terrain_rock', url: 'static/img/terrain/rock-512.jpg' },
                { name: 'terrain_grass', url: 'static/img/terrain/grass-512.jpg' },
                //{name: 'terrain_dirt', url: 'static/img/terrain/dirt-512.jpg'},
                { name: 'terrain_snow', url: 'static/img/terrain/snow-512.jpg' },
                { name: 'terrain_sand', url: 'static/img/terrain/sand-512.jpg' },
                { name: 'terrain_water', url: 'static/img/terrain/water-512.jpg' },
                // vegtype materials
                { name: 'grass_material', url: 'static/img/grass/grass_base.tga' },
                // sagebrush
                { name: 'sagebrush_material', url: 'static/img/sagebrush/sagebrush_1.tga' }
            ],
            geometries: [
                { name: 'grass', url: 'static/json/geometry/grass.json' },
                { name: 'tree', url: 'static/json/geometry/tree.json' },
                { name: 'sagebrush', url: 'static/json/geometry/sagebrush.json' }
            ]
        }, function (loadedAssets) {
            masterAssets = loadedAssets;
        }, function (progress) {
            console.log("Loading assets... " + progress * 100 + "%");
        }, function (error) {
            console.log(error);
            return;
        });
        var spatialExtent = [-1, -1, -1, -1]; // dummy vars for starting out
        function updateTerrain(extent, updateVeg) {
            // confirm params are different
            if (extent.length === 4 // extent is exactly 4 long
                && (terrain == undefined || extent[0] != spatialExtent[0] ||
                    extent[1] != spatialExtent[1] ||
                    extent[2] != spatialExtent[2] ||
                    extent[3] != spatialExtent[3])) {
                spatialExtent = extent;
                if (terrain != undefined) {
                    scene.remove(terrain);
                    for (var key in vegParams) {
                        scene.remove(scene.getObjectByName(key));
                    }
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
                        // testing
                        rock: masterAssets.textures['terrain_rock'],
                        snow: masterAssets.textures['terrain_snow'],
                        grass: masterAssets.textures['terrain_grass'],
                        //dirt: masterAssets.textures['terrain_dirt'],
                        sand: masterAssets.textures['terrain_sand'],
                        water: masterAssets.textures['terrain_water'],
                        vertShader: masterAssets.text['terrain_vert'],
                        fragShader: masterAssets.text['terrain_frag'],
                        data: loadedAssets.statistics['heightmap_stats'],
                        heightmap: loadedAssets.textures['heightmap']
                    });
                    scene.add(terrain);
                    // Add our vegcovers
                    var baseColor = new THREE.Color(55, 80, 100);
                    var i = 0;
                    var maxColors = 7;
                    for (var key in vegParams) {
                        // calculate the veg colors we want to display
                        var r = Math.floor(i / maxColors * 200);
                        var g = Math.floor(i / maxColors * 130);
                        var vegColor = new THREE.Color(baseColor.r + r, baseColor.g + g, baseColor.b);
                        scene.add(veg_1.createVegetation({
                            heightmap: loadedAssets.textures['heightmap'],
                            name: key,
                            tex: masterAssets.textures['sagebrush_material'],
                            geo: masterAssets.geometries['sagebrush'],
                            color: vegColor,
                            vertShader: masterAssets.text['veg_vert'],
                            fragShader: masterAssets.text['veg_frag'],
                            disp: 5.0 / 800.0,
                            cells: {},
                            heightData: loadedAssets.statistics['heightmap_stats'],
                            vegData: { maxHeight: 3100.0, minHeight: 900.0 }
                        }));
                        ++i;
                    }
                    render();
                    if (updateVeg)
                        updateVegetation(vegParams);
                }, function (progress) {
                    console.log("Loading heightmap assets... " + progress * 100 + "%");
                }, function (error) {
                    console.log(error);
                    return;
                });
            }
        }
        function updateVegetation(newParams) {
            for (var key in newParams) {
                if (vegParams.hasOwnProperty(key)) {
                    vegParams[key] = newParams[key]; // update the object to what we want it to be
                    var vegCover = scene.getObjectByName(key);
                    var vegGeo = vegCover.geometry;
                    vegGeo.maxInstancedCount = Math.floor(vegParams[key] / 100 * 5000); // make this a static function
                }
            }
            render();
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
            updateVegetation: updateVegetation,
            resize: resize,
            // debug 
            scene: scene,
            camera: camera
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=landscape-viewer.js.map