require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Mesh",
    "esri/geometry/Point",
    "esri/Graphic"
  ], function(Map, SceneView, GraphicsLayer, Mesh, Point, Graphic) {
  
    const sketchLayer = new GraphicsLayer({
      elevationInfo: {
        mode: "absolute-height"
      },
      title: "Sketched geometries"
    });
  
    const map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation"
    });
  
    const view = new SceneView({
      container: "viewDiv",
      map: map,
      camera: {
        position: [106.8008663430442, 10.863971396764873, 300],
        heading: 0,
        tilt: 50
      }
    });
  
    const house = new Point({
      x: 106.80084488537197,
      y: 10.867532728640802,
      z: 20.2
    });
  
    Mesh.createFromGLTF(house, "./building.glb")
      .then(function(geometry) {
        geometry.scale(50, { origin: house });
        geometry.rotate(0, 0, 300);
        const graphic = new Graphic({
          geometry,
          symbol: {
            type: "mesh-3d",
            symbolLayers: [{
              type: "fill",
              size: 10000
            }]
          }
        });
        sketchLayer.add(graphic);
      })
      .catch(console.error);
  
    const car = new Point({
      x: 106.80080197002785,
      y: 10.86677410529397,
      z: 20.2
    });
  
    Mesh.createFromGLTF(car, "./porsche_gt3_rs.glb")
      .then(function(geometry) {
        geometry.scale(3, { origin: car });
        geometry.rotate(0, 0, 203);
        const graphic = new Graphic({
          geometry,
          symbol: {
            type: "mesh-3d",
            symbolLayers: [{
              type: "fill",
              size: 10000
            }]
          }
        });
        sketchLayer.add(graphic);
      })
      .catch(console.error);
  
    map.add(sketchLayer);
  });
  