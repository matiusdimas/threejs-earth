import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('./8k_earth_daymap.jpg');
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

const earthAndMarkersGroup = new THREE.Group()
earthAndMarkersGroup.add(earthMesh)



const countries = {
    'Netherlands': { lat: 52.3676, lon: 4.9041 },
    'Belgium': { lat: 50.8503, lon: 4.3517 },
    'Germany': { lat: 51.1657, lon: 10.4515 },
    'Austria': { lat: 47.5162, lon: 14.5501 },
    'Sweden': { lat: 60.1282, lon: 18.6435 },
    'Finland': { lat: 61.9241, lon: 25.7482 },
    'Norway': { lat: 60.472, lon: 8.4689 },
    'Denmark': { lat: 56.2639, lon: 9.5018 },
    'UK': { lat: 55.3781, lon: -3.436 }
};

const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

for (const country in countries) {
    const { lat, lon } = countries[country];
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;

    const radius = 5;
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
    markerMesh.position.set(x, y, z);
    markerMesh.name = country
    console.log(markerMesh.name)
    earthAndMarkersGroup.add(markerMesh);
}
scene.add(earthAndMarkersGroup);

camera.position.z = 10;
earthAndMarkersGroup.rotation.x = 90;
earthAndMarkersGroup.rotation.y = 20;

function onMouseEnter(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(earthAndMarkersGroup.children);
    if (intersects.length > 0 && intersects[0].object.name) {
        markerText.innerText = intersects[0].object.name;
        markerText.style.display = 'block';
        markerText.style.top = `${event.clientY}px`;
        markerText.style.left = `${event.clientX}px`;
    } else {
        markerText.style.display = 'none';
    }
}

window.addEventListener('mousemove', onMouseEnter);


function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});