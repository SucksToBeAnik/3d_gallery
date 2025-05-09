"use client";

import dynamic from "next/dynamic";

const ModelCarousel = dynamic(() => import("@/components/ModelCarousel"), {
  ssr: false,
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
