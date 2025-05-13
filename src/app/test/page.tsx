// "use client";

// import { Button } from "@/components/ui/button";
// import { OrbitControls } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
// import { createXRStore, useXRHitTest, XR } from "@react-three/xr";
// import { useRef, useEffect } from "react";
// import { Matrix4, Mesh, Vector3 } from "three";

// function TestModel() {
//   return (
//     <>
//       <mesh position={[0, 0, 0]}>
//         <ringGeometry args={[1, 5, 32]} />
//         <meshToonMaterial color="white" />
//       </mesh>
//     </>
//   );
// }

// function TorusModel() {
//   const torusRef = useRef<Mesh>(null);

//   const matrixHelper = new Matrix4();
//   const hitTestPosition = new Vector3();

//   // Set initial visibility to true so it's visible on mobile
//   useEffect(() => {
//     if (torusRef.current) {
//       torusRef.current.visible = true;
//     }
//   }, []);
//   useXRHitTest((results, getWorldMatrix) => {
//     if (results.length > 0) {
//       console.log("Hit test results found:", results.length);
      
//       getWorldMatrix(matrixHelper, results[0]);
//       hitTestPosition.setFromMatrixPosition(matrixHelper);
      
//       if (torusRef.current) {
//         torusRef.current.position.copy(hitTestPosition);
//         console.log("Updated torus position:", torusRef.current.position);
//       }
//     }
//   }, "viewer");  return (
//     <>
//       <mesh position={[0, 0, -2]} ref={torusRef}>
//         <torusGeometry args={[0.5, 0.2, 16, 64]} />
//         <meshToonMaterial color="hotpink" />
//       </mesh>
//     </>
//   );
// }

// export default function Test() {
//   const store = createXRStore({
//     hitTest: true,
//   });

//   return (
//     <section className="w-screen min-h-[100dvh] bg-gray-700 flex flex-col items-center justify-center">
//       <Canvas camera={{ position: [0, 2, 0] }} style={{ height: "60vh" }}>
//         <XR store={store}>
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[5, 5, 5]} intensity={2} />
//           {/* <TestModel /> */}
//           <TorusModel />
//           {/* <group>
//           </group> */}
//         </XR>
//         <OrbitControls />
//       </Canvas>
//       <Button onClick={() => store.enterAR()}>Enter AR</Button>
//     </section>
//   );
// }

export default function Test() {
  return <div>Test</div>
}