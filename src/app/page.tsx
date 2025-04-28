"use client"

import dynamic from 'next/dynamic';
import Head from 'next/head';

const ModelCarousel = dynamic(() => import('@/components/ModelCarousel'), { 
  ssr: false 
});

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Head>
        <title>3D Model Showcase</title>
        <meta name="description" content="Interactive 3D model carousel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-10 text-center">
          3D Model Showcase
        </h1>
        
        <div className="w-full">
          <ModelCarousel />
        </div>
      </main>
    </div>
  );
}