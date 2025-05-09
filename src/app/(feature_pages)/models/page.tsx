"use client";

import ModelCarousel from "@/components/ModelCarousel";
import { useGLTF } from "@react-three/drei";

const modelConfigs = [
  {path: "/models/shawrma.glb", scale: 15},
  { path: "/models/bread.glb", scale: 15 },
  { path: "/models/burger.glb", scale: 25 },
  { path: "/models/wings.glb", scale: 20 },
];

// Preload all models to improve transition experience
modelConfigs.forEach((config) => {
  useGLTF.preload(config.path);
});

export default function Home() {
  return (
    <div className="container mx-auto px-4 pt-4">
      <main className="flex flex-col items-center">
        <div className="w-full">
          <ModelCarousel />
        </div>
      </main>
    </div>
  );
}
