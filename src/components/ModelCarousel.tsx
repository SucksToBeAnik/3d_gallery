import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Html,
  PerspectiveCamera,
} from "@react-three/drei";
import { Group, Mesh } from "three";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Link2, Loader2 } from "lucide-react";
import "@google/model-viewer";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

const modelConfigs = [
  { path: "/models/bread.glb", scale: 15 },
  { path: "/models/burger.glb", scale: 25 },
  { path: "/models/wings.glb", scale: 20 },
];

// Preload all models to improve transition experience
modelConfigs.forEach((config) => {
  useGLTF.preload(config.path);
});

function Model({
  config,
  visible,
  onLoad,
}: {
  config: (typeof modelConfigs)[0];
  visible: boolean;
  onLoad: () => void;
}) {
  const { scene } = useGLTF(config.path);
  const groupRef = useRef<Group>(null);

  const clonedScene = scene.clone();
  clonedScene.traverse((child) => {
    // Type guard to check if the child is a Mesh with geometry
    if ((child as Mesh).geometry && (child as Mesh).isMesh) {
      const mesh = child as Mesh;
      if (mesh.geometry) {
        mesh.geometry.center();
      }
    }
  });

  // Trigger onLoad whenever visibility changes to true
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      // Small delay to ensure the model has time to render
      timer = setTimeout(() => {
        onLoad();
      }, 300); // Slightly increased timeout for more reliability
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, onLoad]);

  return (
    <group ref={groupRef} visible={visible}>
      <primitive object={clonedScene} scale={config.scale} />
    </group>
  );
}

export default function ModelCarousel() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isInitialMount = useRef(true);

  // Don't show loading on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  const goToPrevious = () => {
    if (currentModelIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentModelIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentModelIndex < modelConfigs.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentModelIndex((prev) => prev + 1);
    }
  };

  const handleModelLoaded = () => {
    // Only call if we're currently transitioning
    if (isTransitioning) {
      setIsTransitioning(false);
    }
  };
  const baseUrl = window.location.origin;
  const modelUrl = `${baseUrl}/ar-view/?model=${modelConfigs[currentModelIndex].path}`;

  return (
    <section className="relative w-full h-[80vh] rounded-lg overflow-hidden bg-gray-900">
      <div className="absolute top-6 left-6 z-10 bg-white/80 p-4 rounded-lg shadow-md">
        <p className="text-sm text-gray-800 font-medium mb-2 text-center">
          Scan to view in AR
        </p>
        <QRCodeSVG
          className="mx-auto"
          value={modelUrl}
          size={100}
          fgColor="#333"
        />
        <p className="text-center text-sm text-gray-800 font-medium mb-2">OR</p>
        <Link href={modelUrl} className="text-blue-400">
          <Link2 className="h-6 w-6 inline-block mr-1" />
          Direct Link
        </Link>
      </div>
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 4, 6]} fov={45} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={1} />
        <Suspense
          fallback={
            <Html center>
              <div className="flex items-center bg-black/50 px-6 py-4 rounded-lg">
                <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
                <span className="text-white text-lg">Loading...</span>
              </div>
            </Html>
          }
        >
          {modelConfigs.map((config, index) => (
            <Model
              key={`${config.path}-${index}`}
              config={config}
              visible={index === currentModelIndex}
              onLoad={handleModelLoaded}
            />
          ))}
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Transition Loading Overlay */}
      {isTransitioning && !isInitialMount.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
          <div className="bg-black/50 px-6 py-4 rounded-lg flex items-center">
            <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
            <span className="text-white text-lg">Loading model...</span>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 top-1/2 flex justify-between -translate-y-1/2 px-4 z-10">
        {currentModelIndex > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform bg-white/80 hover:bg-white text-gray-800"
            onClick={goToPrevious}
            disabled={isTransitioning}
            aria-label="Previous model"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {currentModelIndex < modelConfigs.length - 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform bg-white/80 hover:bg-white text-gray-800 ml-auto"
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="Next model"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Model indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md z-10">
        <span className="text-gray-800 font-medium">
          {currentModelIndex + 1} / {modelConfigs.length}
        </span>
      </div>
    </section>
  );
}
