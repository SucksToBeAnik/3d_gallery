"use client";

import ModelCarousel from "@/components/ModelCarousel";

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
