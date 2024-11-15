require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
    'esri/geometry/Polygon',
    'esri/geometry/Mesh',
    'esri/geometry/Point',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/PolygonSymbol3D',
    'esri/symbols/ExtrudeSymbol3DLayer',
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
            surfaceColor: 'white',
            navigationConstraint: {
                type: 'none',
            },
        },
        layers: [graphicsLayer],
    });

    const view = new SceneView({
        container: 'viewDiv',
        map: map,
        camera: {
            position: [106.7034308243679, 10.775033885080902, 200],
            tilt: 45,
        },
    });

    function createGraphicFromGeoJSON(data) {
        let geometry, symbol;

        if (data.type === 'polygon') {
            geometry = new Polygon({
                rings: data.rings,
                spatialReference: { wkid: 4326 },
            });
            symbol = new SimpleFillSymbol(data.symbol);
        } else if (data.type === 'point') {
            geometry = new Point({
                longitude: data.longitude,
                latitude: data.latitude,
                z: data.z,
            });
            symbol = new SimpleMarkerSymbol(data.symbol);
        } else if (data.type === 'polyline') {
            geometry = new Polyline({
                paths: data.paths,
                spatialReference: { wkid: 4326 },
            });
            symbol = new SimpleLineSymbol(data.symbol);
        }

        return new Graphic({
            geometry,
            symbol,
            attributes: data,
            popupTemplate: data.popupTemplate,
        });
    }

    function createPolygonGraphic(rings) {
        const polygon = new Polygon({
            rings: rings,
            spatialReference: { wkid: 4326 },
        });

        const fillSymbol = new SimpleFillSymbol({
            color: [227, 139, 79, 0.6],
            outline: {
                color: [255, 255, 255],
                width: 1,
            },
        });

        const graphic = new Graphic({
            geometry: polygon,
            symbol: fillSymbol,
        });

        graphicsLayer.add(graphic);
    }

    function createPolylineGraphic(paths) {
        const polyline = new Polyline({
            paths: paths,
            spatialReference: { wkid: 4326 },
        });

        const lineSymbol = new SimpleLineSymbol({
            color: [227, 139, 79, 0.6],
            width: 2,
        });

        const graphic = new Graphic({
            geometry: polyline,
            symbol: lineSymbol,
        });

        graphicsLayer.add(graphic);
    }

    Promise.all([
        fetch('./resources/6.geojson'),
        fetch('./resources/7.geojson'),
    ])
        .then((responses) =>
            Promise.all(responses.map((response) => response.json()))
        )
        .then(([data6, data7]) => {
            // Processing 6.geojson
            data6.forEach((item) => {
                if (item.type === 'polygon') {
                    const geometry = new Polygon({
                        rings: item.rings,
                        spatialReference: { wkid: 4326 },
                    });

                    const symbol = new SimpleFillSymbol({
                        color: item.symbol.color,
                        outline: {
                            color: item.symbol.outline.color,
                            width: item.symbol.outline.width,
                        },
                    });

                    const graphic = new Graphic({
                        geometry: geometry,
                        symbol: symbol,
                        popupTemplate: {
                            title: 'Polygon Feature',
                            content: 'This is a polygon loaded from 6.geojson',
                        },
                    });

                    polygonGraphics.push(graphic);
                }
            });

            if (data7.polygons) {
                data7.polygons.forEach(function (polygonData) {
                    const geometry = new Polygon({
                        rings: polygonData.rings,
                        spatialReference: { wkid: 4326 },
                    });

                    const symbol = new SimpleFillSymbol({
                        color: polygonData.symbol.color,
                        outline: {
                            color: polygonData.symbol.outline.color,
                            width: polygonData.symbol.outline.width,
                        },
                    });

                    const graphic = new Graphic({
                        geometry: geometry,
                        symbol: symbol,
                        popupTemplate: {
                            title: 'Polygon Feature',
                            content: 'This is a polygon loaded from 7.geojson',
                        },
                    });

                    polygonGraphics.push(graphic);
                });
            }
            if (data7.polylines && data7.polylines.length > 0) {
                data7.polylines.forEach(function (polylineData) {
                    const paths = polylineData.paths;
                    const graphic = createPolylineGraphic(paths);
                    polygonGraphics.push(graphic);
                });
            }
        })
        .catch((error) => console.error('Error loading GeoJSON files:', error));

    Promise.all([
        fetch('./resources/2.geojson'),
        fetch('./resources/3.geojson'),
    ])
        .then((responses) =>
            Promise.all(responses.map((response) => response.json()))
        )
        .then(([data2, data3]) => {
            data2.forEach((item) => {
                if (item.type === 'polygon' && item.rings) {
                    const geometry = new Polygon({
                        rings: item.rings,
                        spatialReference: { wkid: 4326 },
                    });

                    const fillSymbol = new SimpleFillSymbol({
                        color: [227, 139, 79],
                        outline: {
                            color: [255, 255, 255],
                            width: 1,
                        },
                    });

                    const graphic = new Graphic({
                        geometry: geometry,
                        symbol: fillSymbol,
                        popupTemplate: {
                            title: 'Polygon Feature',
                            content: 'This is a polygon loaded from 2.geojson',
                        },
                    });

                    polygonGraphics.push(graphic);
                }
            });

            data3.forEach((item) => {
                if (item.type === 'polygon' && item.rings) {
                    const geometry = new Polygon({
                        rings: item.rings,
                        spatialReference: { wkid: 4326 },
                    });

                    const fillSymbol = new SimpleFillSymbol({
                        color: [227, 139, 79],
                        outline: {
                            color: [255, 255, 255],
                            width: 1,
                        },
                    });

                    const graphic = new Graphic({
                        geometry: geometry,
                        symbol: fillSymbol,
                        popupTemplate: {
                            title: 'Polygon Feature',
                            content: 'This is a polygon loaded from 3.geojson',
                        },
                    });

                    polygonGraphics.push(graphic);
                }
            });
        })
        .catch((error) => console.error('Error loading GeoJSON files:', error));

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
                gr;
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
                z: data.z,
            };
            symbol = new SimpleMarkerSymbol({
                color: data.symbol.color,
                outline: data.symbol.outline,
            });
            return new Graphic({
                geometry: geometry,
                symbol: symbol,
                attributes: data,
                popupTemplate: data.popupTemplate,
            });
        }

        if (data.type === 'polyline') {
            geometry = {
                type: 'polyline',
                paths: data.paths,
            };
            symbol = new SimpleLineSymbol({
                color: data.symbol.color,
                width: data.symbol.width,
            });
            return new Graphic({
                geometry: geometry,
                symbol: symbol,
                attributes: data,
                popupTemplate: data.popupTemplate,
            });
        }

        if (data.type === 'polygon') {
            geometry = new Polygon({
                rings: data.rings,
                spatialReference: { wkid: 4326 },
            });
            symbol = new SimpleFillSymbol({
                color: data.symbol.color,
                outline: {
                    color: data.symbol.outline.color,
                    width: data.symbol.outline.width,
                },
            });
            return new Graphic({
                geometry: geometry,
                symbol: symbol,
                attributes: data,
                popupTemplate: data.popupTemplate,
            });
        }

        if (data.type === 'polygon-3d') {
            geometry = new Polygon({
                rings: data.rings,
                spatialReference: { wkid: 4326 },
            });

            const extrusionLayer = new ExtrudeSymbol3DLayer({
                size: data.height,
                material: { color: data.symbol.color || '#7eadf7' },
            });

            symbol = new PolygonSymbol3D({
                symbolLayers: [extrusionLayer],
            });

            return new Graphic({
                geometry: geometry,
                symbol: symbol,
                attributes: data,
                popupTemplate: data.popupTemplate,
            });
        }
    };

    async function fetchData() {
        try {
            const response = await fetch('./resources/4.geojson');
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }

    async function fetchData() {
        try {
            const responses = await Promise.all([
                fetch('./resources/4.geojson'),
                fetch('./resources/1.geojson'),
                fetch('./resources/5.geojson'),
            ]);

            const [data4, data1, data5] = await Promise.all(
                responses.map((response) => response.json())
            );

            data4.points.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data4.lines.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data4.polygons.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data4.polygons_3d.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data1.points.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data1.lines.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data1.polygons.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data1.polygons_3d.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data5.points.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data5.lines.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data5.polygons.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            data5.polygons_3d.forEach(function (data) {
                const graphic = createGraphic(data);
                polygonGraphics.push(graphic);
            });

            map.add(graphicsLayer);
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }

    fetchData();

    const house = new Point({
        longitude: 106.70312358155034,
        latitude: 10.776672366203183,
        z: 0,
        spatialReference: { wkid: 4326 },
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
            graphicsLayer.add(meshGraphic);
        })
        .catch(console.error);

    document
        .getElementById('toggleMeshButton')
        .addEventListener('click', function () {
            const isMeshVisible = graphicsLayer.graphics.includes(meshGraphic);

            if (isMeshVisible) {
                graphicsLayer.remove(meshGraphic);
                polygonGraphics.forEach((graphic) =>
                    graphicsLayer.add(graphic)
                );
            } else {
                graphicsLayer.removeAll();
                graphicsLayer.add(meshGraphic);
            }
        });
});
