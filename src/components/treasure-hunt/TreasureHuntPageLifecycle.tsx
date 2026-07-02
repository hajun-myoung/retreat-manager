"use client";

import { useEffect } from "react";

export function TreasureHuntPageLifecycle() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[treasure_hunt] Mounted: treasure_hunt page");
    }

    return () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[treasure_hunt] Unmounted: treasure_hunt page");
      }
    };
  }, []);

  return null;
}
