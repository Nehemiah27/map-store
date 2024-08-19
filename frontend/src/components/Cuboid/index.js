import * as BABYLON from "@babylonjs/core";

const canvaSettings = () => {
  const canvas = document.createElement("canvas");
  canvas.id = "canvas-saved-view";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.resize = "both";
  canvas.style.overflow = "hidden";
  canvas.addEventListener("wheel", (evt) => evt.preventDefault());
  document.getElementById("saved-view").appendChild(canvas);
  return canvas;
};

const engineDefaults = (engine, scene) => {
  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
};

const Cuboid = (imageURL) => {
  const canvas = canvaSettings(),
    engine = new BABYLON.Engine(canvas, true),
    scene = new BABYLON.Scene(engine),
    camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 4,
      4,
      BABYLON.Vector3.Zero(),
      scene
    );
  camera.minZ = 0.1;
  camera.maxZ = 10000;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 10;
  camera.attachControl(canvas, true);
  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene),
    material = new BABYLON.StandardMaterial("material", scene),
    texture = new BABYLON.Texture(imageURL, scene);
  material.diffuseTexture = texture;
  box.material = material;
  engineDefaults(engine, scene);
};

export default Cuboid;
