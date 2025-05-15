"use client";

import { Suspense, useEffect, useState } from "react";
import { Loader2, RectangleGoggles } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

function ModelViewer({ modelPath }: { modelPath: string | null }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    import("@google/model-viewer").then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (isReady && modelPath) {
      const timer = setTimeout(() => {
        const modelViewer = document.querySelector("model-viewer");
        if (modelViewer && "activateAR" in modelViewer) {
          modelViewer.activateAR();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isReady, modelPath]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center bg-black size-full min-h-screen">
        <div className="p-6 rounded-lg flex items-center">
          <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
          <span className="text-white text-lg">Loading model...</span>
        </div>
      </div>
    );
  }

  if (!modelPath) {
    return <p className="text-center mt-20 text-red-600">No model provided.</p>;
  }
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <model-viewer
        src={modelPath}
        ar
        ar-modes="scene-viewer quick-look webxr"
        ar-status="auto-enter-ar"
        auto-rotate
        autoActivate
        camera-controls
        interaction-prompt-threshold="0"
        style={{ width: "100%", height: "100%" }}
      >
        <Button slot="ar-button" className="absolute bottom-4 right-4">
          <RectangleGoggles className="h-6 w-6 mr-1" />
          Activate AR
        </Button>
      </model-viewer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
      <div className="bg-black/50 px-6 py-4 rounded-lg flex items-center">
        <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
        <span className="text-white text-lg">Loading page...</span>
      </div>
    </div>
  );
}

// Client Component that uses useQueryState
function ARViewerContent() {
  const [modelPath] = useQueryState("model");
  return <ModelViewer modelPath={modelPath} />;
}

export default function ARViewerPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ARViewerContent />
    </Suspense>
  );
}
