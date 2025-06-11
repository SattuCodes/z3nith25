import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function initScene() {
    const container = document.querySelector('.threeD');
    container.textContent = '';

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        1,
        1000
    );
    camera.position.set(10, 10, 11);

    const loader = new GLTFLoader().setPath('assets/');
    loader.load(
        'scene.gltf',
        (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            model.scale.set(8, 8, 8);
            model.position.set(8, 7, 0);
            model.rotation.y = (3 * Math.PI) / 2;
            scene.add(model);

            const progressBar = document.getElementById('progress-container');
            if (progressBar) progressBar.style.display = 'none';
        },
        (xhr) => {
            console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
        },
        (error) => {
            console.error(error);
        }
    );

    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}
initScene();
