"use client";

import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { useState, useRef } from "react";
import { Container, Root, Text } from "@react-three/uikit";
import { Button, Defaults } from "@react-three/uikit-default";
import { Group, Object3DEventMap } from "three";

function Model({
  modelPath,
  scale = 15,
}: {
  modelPath: string;
  scale?: number;
}) {
  const { scene } = useGLTF(modelPath, true);
  const modelRef = useRef<Group<Object3DEventMap> | null>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

const store = createXRStore();

export default function Page() {
  const modelPath = "/models/bread.glb";
  const [modelScale, setModelScale] = useState(15);

  const handleScaleDown = () => {
    setModelScale((prevScale) => Math.max(5, prevScale - 2));
  };

  const handleScaleUp = () => {
    setModelScale((prevScale) => prevScale + 2);
  };

  return (
    <>
      <button
        className="absolute z-1000 p-2 m-4 bg-black text-white rounded top-0 left-0"
        onClick={() => store.enterAR()}
      >
        Enter AR
      </button>

      <Canvas className="w-full h-screen" style={{ height: "100vh" }}>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <OrbitControls />

          {/* 3D Model */}
          <group position={[0, -2, -4]}>
            <Model modelPath={modelPath} scale={modelScale} />
          </group>

          {/* UI Buttons - Place in front of user */}
          <group position={[0, 1.5, -2]} /* right in front of camera */>
            <Defaults>
              <Root>
                <Container
                  flexDirection="column"
                  alignItems="center"
                  gap={0.2}
                  padding={0.3}
                  backgroundColor="white"
                  borderRadius={0.1}
                >
                  <Button
                    width={1}
                    onClick={handleScaleDown}
                    backgroundColor="#1e88e5"
                    flexGrow={1}
                    variant="secondary"
                  >
                    <Text fontSize={11}>Scale Down</Text>
                  </Button>
                  <Button
                    width={1}
                    onClick={handleScaleUp}
                    backgroundColor="#1e88e5"
                    flexGrow={1}
                    variant="default"
                  >
                    <Text fontSize={11}>Scale Up</Text>
                  </Button>
                </Container>
              </Root>
            </Defaults>
          </group>
        </XR>
      </Canvas>
    </>
  );
}
