let meshGraphic;

Mesh.createFromGLTF(house, './resources/opera_house_HCM.glb')
.then(function (geometry) {
    geometry.scale(24, { origin: house });
    geometry.rotate(0, 0, 318);
    meshGraphic = new Graphic({
        geometry,
        symbol: {
            type: 'mesh-3d',
            symbolLayers: [
                {
                    type: 'fill',
                },
            ],
        },
    });
    graphicsLayer.add(meshGraphic);
})
.catch(console.error);

document
        .getElementById('toggleMeshButton')
        .addEventListener('click', function () {
            if (meshGraphic) { // Ensure meshGraphic is defined before checking
                if (graphicsLayer.graphics.includes(meshGraphic)) {
                    graphicsLayer.remove(meshGraphic); // Remove Mesh if currently visible
                } else {
                    graphicsLayer.add(meshGraphic); // Add Mesh if currently hidden
                }
            }
        });





        fetch('./resources/boundary.geojson')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((feature) => {
                // Access the coordinates from the 'geojson' property
                const coordinates = feature.geojson.coordinates;

                // Add Z coordinate (height) to each point in the polygon
                const coordinatesWithZ = coordinates[0].map((point) => [
                    ...point,
                    0, // Assuming a height of 0, you can modify this as needed
                ]);

                // Create the polygon geometry
                const polygonGeometry = new Polygon({
                    rings: [coordinatesWithZ], // Create the polygon with the coordinates
                    spatialReference: { wkid: 4326 },
                });

                // Create the graphic for the polygon
                const polygonGraphic = new Graphic({
                    geometry: polygonGeometry,
                    symbol: new SimpleFillSymbol({
                        color: [51, 51, 204, 0.3], // Set the fill color
                        outline: {
                            color: [51, 51, 204], // Set the outline color
                            width: 2,
                        },
                    }),
                    attributes: feature,
                    popupTemplate: {
                        title: '{name}',
                        content: '{display_name}',
                    },
                });

                // Add the polygon graphic to the graphics layer
                graphicsLayer.add(polygonGraphic);
            });
        })
        .catch(console.error);


        /// lưu trữ:

        require([
            "esri/Map",
            "esri/views/SceneView",
            "esri/layers/GraphicsLayer",
            "esri/Graphic",
            "esri/geometry/Polygon", // Import the Polygon geometry class
            "esri/symbols/SimpleFillSymbol", // Import the symbol class for styling
            "esri/symbols/SimpleMarkerSymbol", // Import the symbol class for point styling
            "esri/symbols/SimpleLineSymbol" // Import the symbol class for line styling
        ], function (
            Map,
            SceneView,
            GraphicsLayer,
            Graphic,
            Polygon,
            SimpleFillSymbol,
            SimpleMarkerSymbol,
            SimpleLineSymbol
        ) {
        
            const graphicsLayer = new GraphicsLayer({
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
        
            const map = new Map({
                basemap: 'osm',
                ground: 'world-elevation',
                layers: [graphicsLayer],
            });
        
            const view = new SceneView({
                container: 'viewDiv',
                map: map,
                camera: {
                    position: [106.70313711899303, 10.776613099520674, 200],
                    tilt: 0,
                },
            });
        
            // Create a graphic for any geometry (point, line, polygon)
            var createGraphic = function (data) {
                let geometry;
                // For Points
                if (data.type === 'point') {
                    geometry = {
                        type: 'point',
                        longitude: data.x,
                        latitude: data.y,
                        z: data.z
                    };
                    const symbol = new SimpleMarkerSymbol({
                        color: data.symbol.color,
                        outline: data.symbol.outline
                    });
                    return new Graphic({
                        geometry: geometry,
                        symbol: symbol,
                        attributes: data,
                        popupTemplate: data.popupTemplate
                    });
                }
        
                // For Lines
                if (data.type === 'polyline') {
                    geometry = {
                        type: 'polyline',
                        paths: data.paths
                    };
                    const symbol = new SimpleLineSymbol({
                        color: data.symbol.color,
                        width: data.symbol.width
                    });
                    return new Graphic({
                        geometry: geometry,
                        symbol: symbol,
                        attributes: data,
                        popupTemplate: data.popupTemplate
                    });
                }
        
                // For Polygons
                if (data.type === 'polygon') {
                    geometry = new Polygon({
                        rings: data.rings,
                        spatialReference: { wkid: 4326 }  // Assuming WGS84
                    });
                    const symbol = new SimpleFillSymbol({
                        color: data.symbol.color,
                        outline: {
                            color: data.symbol.outline.color,
                            width: data.symbol.outline.width
                        }
                    });
                    return new Graphic({
                        geometry: geometry,
                        symbol: symbol,
                        attributes: data,
                        popupTemplate: data.popupTemplate
                    });
                }
            };
        
            // Fetch the data from the external JSON file
            async function fetchData() {
                try {
                    const response = await fetch('./resources/4_1.geojson');
                    const data = await response.json();
                    console.log(data);
                    return data;
                } catch (error) {
                    console.error('Error fetching the data:', error);
                }
            }
        
            fetchData().then(fetchedData => {
                fetchedData.points.forEach(function(data) {
                    graphicsLayer.add(createGraphic(data));
                });
                
                fetchedData.lines.forEach(function(data) {
                    graphicsLayer.add(createGraphic(data));
                });
                
                fetchedData.polygons.forEach(function(data) {
                    graphicsLayer.add(createGraphic(data));
                });
        
                map.add(graphicsLayer);
            });
        
        });
        

        [106.7032174807433, 10.776493371756995, 0],
        [106.70332736357508, 10.776612242334716, 0],
        [106.70332736357508, 10.776612242334716, 1.95],
        [106.7032174807433, 10.776493371756995, 1.95],
        [106.70321574254915, 10.776494935735736, 2.92],
        [106.70332562538093, 10.776613806313456, 2.92],
        [106.70332736357508, 10.776612242334716, 1.95],
        [106.7032174807433, 10.776493371756995, 1.95],
        [106.7032174807433, 10.776493371756995, 0],
        [106.70321574254915, 10.776494935735736, 0],
        [106.70332562538093, 10.776613806313456, 0],
        [106.70332562538093, 10.776613806313456, 2.92],
        [106.70321574254915, 10.776494935735736, 2.92],
        [106.70321574254915, 10.776494935735736, 0]