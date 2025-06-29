// cameraControls.js
import * as THREE from "three";

const keysPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  q: false,
  e: false,
  shift: false,
};

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let yaw = 0;
let pitch = 0;

export function setupKeyboardControls() {
  window.addEventListener("keydown", (event) => {
    keysPressed[event.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (event) => {
    keysPressed[event.key.toLowerCase()] = false;
  });
}

export function setupMouseLook(camera, domElement) {
  domElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
  });

  domElement.addEventListener("mouseup", () => {
    isDragging = false;
  });

  domElement.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - previousMousePosition.x;
    const dy = e.clientY - previousMousePosition.y;

    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;

    const sensitivity = 0.002; // Ajusta la sensibilidad del mouse

    yaw -= dx * sensitivity;
    pitch -= dy * sensitivity;

    // Limitar el ángulo vertical
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    camera.rotation.set(pitch, yaw, 0, "ZYX");
  });
}

export function updateCameraMovement(camera, delta) {
  const speed = keysPressed.shift ? 5 : 2;
  const distance = delta * speed;

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(direction, camera.up).normalize();

  if (keysPressed.w) camera.position.addScaledVector(direction, distance);
  if (keysPressed.s) camera.position.addScaledVector(direction, -distance);
  if (keysPressed.a) camera.position.addScaledVector(right, -distance);
  if (keysPressed.d) camera.position.addScaledVector(right, distance);
  if (keysPressed.q) camera.position.y += distance;
  if (keysPressed.e) camera.position.y -= distance;
}
