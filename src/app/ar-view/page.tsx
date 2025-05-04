"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";

export default function ARViewerPage() {
  const [modelPath] = useQueryState("model");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    import("@google/model-viewer").then(() => setIsReady(true));
  }, []);

  if (!isReady)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
        <div className="bg-black/50 px-6 py-4 rounded-lg flex items-center">
          <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
          <span className="text-white text-lg">Loading model...</span>
        </div>
      </div>
    );

  if (!modelPath) {
    return <p className="text-center mt-20 text-red-600">No model provided.</p>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <model-viewer
        src={modelPath}
        ar
        ar-modes="scene-viewer quick-look webxr"
        auto-rotate
        camera-controls
        reveal="auto"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
