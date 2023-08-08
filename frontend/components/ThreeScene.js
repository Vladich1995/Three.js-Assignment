import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';

const ThreeScene = () => {
  const [loadedScene, setLoadedScene] = useState(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  let lastAddedElement; 

  useEffect(() => {
    const loadSceneData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/scenes/scene_id'); 
        setLoadedScene(response.data);
      } catch (error) {
        console.error('Error loading scene data:', error);
      }
    };
  
    loadSceneData();
  }, []);

  const createRandomElement = async () => {
    const randomNumber = Math.random();

    if (randomNumber < 0.5) {
      await addPyramid();
    } else {
      await addNumber();
    }
    await saveSceneData();
  };

  const addPyramid = async () => {
    const pyramidGeometry = new THREE.ConeGeometry(1, 2, 4);
    const pyramidMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);


    pyramid.position.set(0, 1.5, 0); 
    lastAddedElement.add(pyramid);

    lastAddedElement = pyramid; 
  };

  const addNumber = async () => {
    const loader = new THREE.FontLoader();
    const randomNumber = Math.floor(Math.random() * 10); 
    loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new THREE.TextGeometry(randomNumber.toString(), {
        font: font,
        size: 1,
        height: 0.1,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const number = new THREE.Mesh(textGeometry, textMaterial);

      number.position.set(0, 1.5, 0); 
      lastAddedElement.add(number);

      lastAddedElement = number; 
    });
  };

  const saveSceneData = async () => {
    const elements = sceneRef.current.children.map(child => ({
      type: child.geometry.type,
      position: child.position,
    }));


    await axios.post('http://localhost:3001/api/scenes', { elements });
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene; 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    lastAddedElement = cube; 

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div>
      <button style={{position:"absolute", top: "100px"}}  onClick={createRandomElement}>Add Random Element</button>
      <div ref={containerRef}></div>
    </div>
  );
};

export default ThreeScene;








