"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center size-full min-h-screen w-screen">
      <Button>
        <Link href="/models">
          <span className="text-white">View Available Models</span>
        </Link>
      </Button>
    </div>
  );
}
