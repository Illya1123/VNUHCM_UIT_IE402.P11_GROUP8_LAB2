require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Polygon",
    "esri/geometry/Mesh",
    "esri/geometry/Point",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PolygonSymbol3D",
    "esri/symbols/ExtrudeSymbol3DLayer"
], function (
    Map,
    SceneView,
    GraphicsLayer,
    Graphic,
    Polygon,
    Mesh,
    Point,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    PolygonSymbol3D,
    ExtrudeSymbol3DLayer
) {

    const graphicsLayer = new GraphicsLayer({
        elevationInfo: {
            mode: 'relative-to-ground',
        },
    });

    const map = new Map({
        basemap: 'osm',
        ground: {
            surfaceColor: "white",
            navigationConstraint: {
                type: "none"
            }
        },
        layers: [graphicsLayer],
    });

    const view = new SceneView({
        container: 'viewDiv',
        map: map,
        camera: {
            position: [106.70313711899303, 10.776613099520674, 100],
            tilt: 0,
        },
    });

    let meshGraphic;
    let polygonGraphics = [];

    fetch('./resources/boundary.geojson')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((feature) => {
                const coordinates = feature.geojson.coordinates;
                const coordinatesWithZ = coordinates[0].map((point) => [
                    ...point,
                    0,
                ]);

                const polygonGeometry = new Polygon({
                    rings: [coordinatesWithZ],
                    spatialReference: { wkid: 4326 },
                });

                const polygonGraphic = new Graphic({
                    geometry: polygonGeometry,
                    symbol: new SimpleFillSymbol({
                        color: [51, 51, 204, 0.3],
                        outline: {
                            color: [51, 51, 204],
                            width: 2,
                        },
                    }),
                    attributes: feature,
                    popupTemplate: {
                        title: '{name}',
                        content: '{display_name}',
                    },
                });

                polygonGraphics.push(polygonGraphic);
                graphicsLayer.add(polygonGraphic);
            });
        })
        .catch(console.error);

    var createGraphic = function (data) {
        let geometry;
        let symbol;

        if (data.type === 'point') {
            geometry = {
                type: 'point',
                longitude: data.x,
                latitude: data.y,
                z: data.z
            };
            symbol = new SimpleMarkerSymbol({
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

        if (data.type === 'polyline') {
            geometry = {
                type: 'polyline',
                paths: data.paths
            };
            symbol = new SimpleLineSymbol({
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

        if (data.type === 'polygon') {
            geometry = new Polygon({
                rings: data.rings,
                spatialReference: { wkid: 4326 }
            });
            symbol = new SimpleFillSymbol({
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

        if (data.type === 'polygon-3d') {
            geometry = new Polygon({
                rings: data.rings,
                spatialReference: { wkid: 4326 }
            });

            const extrusionLayer = new ExtrudeSymbol3DLayer({
                size: data.height,
                material: { color: data.symbol.color || "#7eadf7" }
            });

            symbol = new PolygonSymbol3D({
                symbolLayers: [extrusionLayer]
            });

            return new Graphic({
                geometry: geometry,
                symbol: symbol,
                attributes: data,
                popupTemplate: data.popupTemplate
            });
        }
    };

    async function fetchData() {
        try {
            const response = await fetch('./resources/1.geojson');
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }

    fetchData().then(fetchedData => {
        fetchedData.points.forEach(function (data) {
            const graphic = createGraphic(data);
            polygonGraphics.push(graphic);
            graphicsLayer.add(graphic);
        });

        fetchedData.lines.forEach(function (data) {
            const graphic = createGraphic(data);
            polygonGraphics.push(graphic);
            graphicsLayer.add(graphic);
        });

        fetchedData.polygons.forEach(function (data) {
            const graphic = createGraphic(data);
            polygonGraphics.push(graphic);
            graphicsLayer.add(graphic);
        });

        fetchedData.polygons_3d.forEach(function (data) {
            const graphic = createGraphic(data);
            polygonGraphics.push(graphic);
            graphicsLayer.add(graphic);
        });

        map.add(graphicsLayer);
    });

    const house = new Point({
        longitude: 106.7030463317754,
        latitude: 10.776694787333371,
        z: 0,
        spatialReference: { wkid: 4326 }
    });

    Mesh.createFromGLTF(house, './resources/opera_house_HCM.glb')
        .then(function (geometry) {
            geometry.scale(24, { origin: house });
            geometry.rotate(0, 0, 318);

            meshGraphic = new Graphic({
                geometry: geometry,
                symbol: {
                    type: 'mesh-3d',
                    symbolLayers: [
                        {
                            type: 'fill',
                        },
                    ],
                },
            });
        })
        .catch(console.error);

    document
        .getElementById('toggleMeshButton')
        .addEventListener('click', function () {
            if (meshGraphic) {
                if (graphicsLayer.graphics.includes(meshGraphic)) {
                    graphicsLayer.remove(meshGraphic);
                    polygonGraphics.forEach(graphic => graphicsLayer.add(graphic));
                } else {
                    graphicsLayer.add(meshGraphic);
                    polygonGraphics.forEach(graphic => graphicsLayer.remove(graphic));
                }
            }
        });

    view.on("click", function(event) {
        const { latitude, longitude } = event.mapPoint;
        console.log(`${longitude}, ${latitude}`)
    });
});
