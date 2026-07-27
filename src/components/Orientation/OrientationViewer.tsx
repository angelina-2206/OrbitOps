import React, { useEffect, useRef, useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import * as THREE from 'three';
import { Box, RotateCcw, Eye, Maximize2 } from 'lucide-react';

export const OrientationViewer: React.FC = () => {
  const { currentPacket } = useTelemetryStore();
  const mountRef = useRef<HTMLDivElement>(null);

  const roll = currentPacket?.roll || 0;
  const pitch = currentPacket?.pitch || 0;
  const yaw = currentPacket?.yaw || 0;

  const cubeRef = useRef<THREE.Group | null>(null);
  const isWireframeRef = useRef<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3.5, 3, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Starfield Background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 200;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 50;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0x64748b, size: 0.15 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 3D CubeSat Model Group
    const cubeGroup = new THREE.Group();

    // Metallic Cube Body
    const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00d4ff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    cubeGroup.add(wireframe);

    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6,
    });
    const cubeMesh = new THREE.Mesh(geometry, meshMaterial);
    cubeGroup.add(cubeMesh);

    // Coordinate Axes (X=Red, Y=Green, Z=Blue)
    const axesHelper = new THREE.AxesHelper(2.2);
    cubeGroup.add(axesHelper);

    scene.add(cubeGroup);
    cubeRef.current = cubeGroup;

    // Grid Floor
    const grid = new THREE.GridHelper(10, 10, 0x1f2937, 0x111827);
    grid.position.y = -1.5;
    scene.add(grid);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Roll, Pitch, Yaw rotation in real-time
  useEffect(() => {
    if (cubeRef.current) {
      const rollRad = (roll * Math.PI) / 180;
      const pitchRad = (pitch * Math.PI) / 180;
      const yawRad = (yaw * Math.PI) / 180;
      cubeRef.current.rotation.set(pitchRad, yawRad, rollRad);
    }
  }, [roll, pitch, yaw]);

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <Box className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            3D CUBESAT ATTITUDE
          </span>
        </div>

        {/* Orientation Badges */}
        <div className="flex items-center space-x-2 font-mono text-[10px]">
          <span className="text-slate-400">R: <strong className="text-[#00D4FF]">{roll}°</strong></span>
          <span className="text-slate-400">P: <strong className="text-[#00FF84]">{pitch}°</strong></span>
          <span className="text-slate-400">Y: <strong className="text-amber-400">{yaw}°</strong></span>
        </div>
      </div>

      {/* 3D WebGL Canvas Area */}
      <div className="flex-1 w-full rounded-lg overflow-hidden border border-[#1F2937] relative min-h-[220px]" ref={mountRef}>
        {/* Floating Controls Overlay */}
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className="p-1.5 rounded bg-[#111827]/80 hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] transition-all"
            title="Toggle Wireframe Mode"
          >
            <Eye className="w-3.5 h-3.5 text-[#00D4FF]" />
          </button>
        </div>

        {/* WebGL Indicator */}
        <div className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-slate-500 bg-[#070B14]/80 px-2 py-0.5 rounded border border-[#1F2937]">
          WebGL 3D Real-Time
        </div>
      </div>
    </div>
  );
};
