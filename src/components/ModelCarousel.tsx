"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Html,
  PerspectiveCamera,
} from "@react-three/drei";
import type { Group, Mesh } from "three";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2, View } from "lucide-react";
import { useMobile } from "@/components/useMobile";

const modelConfigs = [
  {
    path: "/models/burger.glb",
    scale: 25,
    name: "Classic Cheeseburger",
    price: "BDT 350",
    weight: "280g",
    calories: "750 kcal",
    ingredients:
      "Beef patty, cheddar cheese, lettuce, tomato, pickles, special sauce, brioche bun",
    description:
      "Juicy grilled beef patty topped with melted cheese and fresh veggies on a toasted brioche bun.",
  },
  {
    path: "/models/shawrma.glb",
    scale: 5,
    name: "Shawarma Wrap",
    price: "BDT 250",
    weight: "350g",
    calories: "520 kcal",
    ingredients: "Chicken, pita bread, garlic sauce, tomatoes, onions",
    description:
      "Tender marinated chicken wrapped in a warm pita with our signature sauce and fresh vegetables.",
  },
  {
    path: "/models/bread.glb",
    scale: 15,
    name: "Sourdough Loaf",
    price: "BDT 150",
    weight: "300g",
    calories: "270 kcal per 100g",
    ingredients: "Organic flour, water, salt, sourdough starter",
    description:
      "Freshly baked sourdough with a perfect crust and soft interior. Made with our 24-hour fermented starter.",
  },
  {
    path: "/models/wings.glb",
    scale: 20,
    name: "Spicy Chicken Wings",
    price: "BDT 300",
    weight: "450g",
    calories: "850 kcal",
    ingredients:
      "Chicken wings, BBQ sauce, butter, garlic powder, salt, pepper",
    description:
      "Crispy fried wings tossed in our signature spicy buffalo sauce. Served with blue cheese dip.",
  },
];

// // Preload all models to improve transition experience
// modelConfigs.forEach((config) => {
//   useGLTF.preload(config.path);
// });

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
  const isMobile = useMobile();
  const [modelsLoaded, setModelsLoaded] = useState(() => {
    const init: boolean[] = [];
    for (let i = 0; i < modelConfigs.length; i++) {
      init.push(false);
    }
    return init;
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (
      currentModelIndex < modelConfigs.length - 1 &&
      !modelsLoaded[currentModelIndex + 1]
    ) {
      console.log(
        "Pre laoding model:",
        modelConfigs[currentModelIndex + 1].name
      );
      useGLTF.preload(modelConfigs[currentModelIndex + 1].path);
    }
  }, [currentModelIndex, modelsLoaded]);

  const goToPrevious = () => {
    if (currentModelIndex > 0 && !isTransitioning) {
      // if (!modelsLoaded[currentModelIndex]) {
      //   setIsTransitioning(true);
      //   setModelsLoaded((prev) => {
      //     const newLoaded = [...prev];
      //     newLoaded[currentModelIndex] = true;
      //     return newLoaded;
      //   });
      // }
      setCurrentModelIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentModelIndex < modelConfigs.length - 1 && !isTransitioning) {
      if (!modelsLoaded[currentModelIndex + 1]) {
        setIsTransitioning(true);
        setModelsLoaded((prev) => {
          const newLoaded = [...prev];
          newLoaded[currentModelIndex + 1] = true;
          return newLoaded;
        });
      }
      setCurrentModelIndex((prev) => prev + 1);
    }
  };

  const handleModelLoaded = () => {
    // Only call if we're currently transitioning
    if (isTransitioning) {
      setIsTransitioning(false);
    }
  };

  // Current model information
  const currentModel = modelConfigs[currentModelIndex];

  return (
    <section className="relative w-full h-full md:h-[80vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
        {/* 3D Model Canvas - Takes 3/5 of the space on desktop */}
        <div className="relative col-span-1 lg:col-span-3 h-[50vh] lg:h-full">
          <Canvas className="w-full h-full">
            <PerspectiveCamera
              makeDefault
              position={isMobile ? [0, 3, 8] : [0, 4, 6]}
              fov={45}
            />
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
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 flex justify-between -translate-y-1/2 px-4 z-10">
            {currentModelIndex > 0 && (
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg hover:scale-105 transition-transform bg-white/80 hover:bg-white text-gray-800"
                onClick={goToPrevious}
                disabled={isTransitioning}
                aria-label="Previous model"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            )}

            {currentModelIndex < modelConfigs.length - 1 && (
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg hover:scale-105 transition-transform bg-white/80 hover:bg-white text-gray-800 ml-auto"
                onClick={goToNext}
                disabled={isTransitioning}
                aria-label="Next model"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            )}
          </div>

          {/* Model indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md z-10">
            <div className="flex space-x-2">
              {modelConfigs.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentModelIndex ? "bg-slate-800" : "bg-slate-400"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Food Information Panel - Takes 2/5 of the space on desktop */}
        <Card className="col-span-1 lg:col-span-2 border-0 rounded-none shadow-none bg-white h-full py-0">
          <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 px-6">
            {currentModel.name}
          </CardTitle>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xl font-semibold text-emerald-600">
                    {currentModel.price}
                  </span>
                  <div className="flex flex-wrap gap-2 ml-auto">
                    <Badge variant="secondary" className="font-normal">
                      {currentModel.weight}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {currentModel.calories}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                {currentModel.description}
              </p>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-slate-800 mb-2">
                  Ingredients:
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentModel.ingredients}
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-medium text-slate-800 mb-3">
                  Nutritional Info:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500">Protein</div>
                    <div className="font-medium">24g</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500">Carbs</div>
                    <div className="font-medium">48g</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500">Fat</div>
                    <div className="font-medium">18g</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs text-slate-500">Fiber</div>
                    <div className="font-medium">3g</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="mb-2 mt-auto">
            <Button
              variant="outline"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
              onClick={() =>
                window.open(`/ar-view/?model=${currentModel.path}`, "_blank")
              }
            >
              <View className="mr-2 h-4 w-4" />
              View in AR
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Transition Loading Overlay */}
      {isTransitioning && !isInitialMount.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
          <div className="bg-black/50 px-6 py-4 rounded-lg flex items-center">
            <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
            <span className="text-white text-lg">Loading model...</span>
          </div>
        </div>
      )}
    </section>
  );
}
