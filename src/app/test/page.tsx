"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";


export default function Test() {
    return (
        <section className="w-screen h-screen min-h-screen bg-gray-700 flex items-center justify-center">
           <Canvas className="h-full bg-red-600">
            {/* <axesHelper args={[5]} />
            <gridHelper args={[20, 20, 0xff0000, 'teal']} /> */}

            <mesh scale={1.5} position={[0, 0, 0]}>
                <torusGeometry args={[8, 0.4, 16, 8000]} />
                <meshToonMaterial color="hotpink" />
            </mesh>

            <ambientLight intensity={0.5} />
            <directionalLight position={[3.3, 1.0, 4.4]} intensity={4} />

            <OrbitControls />
        </Canvas> 
        </section>
        
    );
}
