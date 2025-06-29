import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 4);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(1, 2, 2);
light.castShadow = true;
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
light2.position.set(-1, 2, 2);
light2.castShadow = true;
scene.add(light2);

const pointLight = new THREE.PointLight(0x00ffff, 0.5);
pointLight.position.set(-0.3, 0.8, 0.1);
pointLight.castShadow = true;
pointLight.distance = 0.8;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x00ffff, 0.5);
pointLight2.position.set(-0.3, 1.6, 0.1);
pointLight2.castShadow = true;
pointLight2.distance = 0.8;
scene.add(pointLight2);

// const lHelper = new THREE.CameraHelper(pointLight.camera);
const lHelper = new THREE.PointLightHelper(pointLight, 0.05);
scene.add(lHelper);
const lHelper2 = new THREE.PointLightHelper(pointLight2, 0.05);
scene.add(lHelper2);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 1.5),
  new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide })
);
plane.rotation.x = -Math.PI / 2;
plane.position.set(-0.5, 0, 0.2);
plane.receiveShadow = true;
scene.add(plane);

// const loader = new FBXLoader();
// loader.load(
//   "EST GUST 1.fbx",
//   function (object) {
//     object.scale.set(0.01, 0.01, 0.01);
//     object.rotation.x = -Math.PI / 2;
//     object.rotation.z = -Math.PI / 2;
//     object.position.set(0, 0, 0);
//     object.traverse(function (child) {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }

//     });
//     scene.add(object);
//   },
//   undefined,
//   function (error) {
//     console.error("Error al cargar el FBX:", error);
//   }
// );

const loader = new GLTFLoader();
loader.load(
  "est-gust-1.glb",
  function (gltf) {
    const object = gltf.scene;
    object.scale.set(0.2, 0.2, 0.2);
    object.rotation.x = -Math.PI / 2;
    object.rotation.z = -Math.PI / 2;
    object.position.set(0, 0, 0);
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(object);

    // ❌ Ocultar el loader al terminar
    const loaderDiv = document.getElementById("loader");
    if (loaderDiv) loaderDiv.style.display = "none";
  },
  function (xhr) {
    // ✅ Mostrar progreso si deseas (opcional)
    // const percent = (xhr.loaded / xhr.total) * 100;
    const loadingText = document.getElementById("loading-text");
    if (loadingText && xhr.lengthComputable) {
      loadingText.textContent = `Cargando modelo ...`;
    }
  },
  function (error) {
    console.error("Error al cargar el GLB:", error);
    const loadingText = document.getElementById("loading-text");
    if (loadingText) {
      loadingText.textContent = "Error al cargar el modelo.";
    }
  }
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
