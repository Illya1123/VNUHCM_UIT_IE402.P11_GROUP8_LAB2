// require([
//   "esri/Map",
//   "esri/views/SceneView",
//   "esri/layers/GraphicsLayer",
//   "esri/geometry/Polygon",
//   "esri/Graphic",
//   "esri/symbols/SimpleFillSymbol"
// ], function(Map, SceneView, GraphicsLayer, Polygon, Graphic, SimpleFillSymbol) {

//   const graphicsLayer = new GraphicsLayer({
//     elevationInfo: {
//       mode: "on-the-ground"
//     }
//   });

//   const map = new Map({
//     basemap: "topo-vector",
//     ground: "world-elevation",
//     layers: [graphicsLayer]
//   });

//   const view = new SceneView({
//     container: "viewDiv",
//     map: map,
//     camera: {
//       position: [106.70313711899303, 10.776613099520674, 300],
//       tilt: 0
//     }
//   });

//   fetch("./resources/Area6.geojson")
//     .then(response => response.json())
//     .then(data => {
//       data.forEach(feature => {
//         const coordinates = feature.geojson.coordinates;

//         const coordinatesWithZ = coordinates[0].map(point => [...point, 0]);

//         const polygonGeometry = new Polygon({
//           rings: [coordinatesWithZ],
//           spatialReference: { wkid: 4326 }
//         });

//         const polygonGraphic = new Graphic({
//           geometry: polygonGeometry,
//           symbol: new SimpleFillSymbol({
//             color: [51, 51, 204, 0.3],
//             outline: {
//               color: [51, 51, 204],
//               width: 2
//             }
//           }),
//           attributes: feature,
//           popupTemplate: {
//             title: "{name}",
//             content: "{display_name}"
//           }
//         });
//         graphicsLayer.add(polygonGraphic);
//       });
//     })
//     .catch(console.error);
// });