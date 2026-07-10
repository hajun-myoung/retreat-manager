"use client";

import { useEffect, useState } from "react";

export function FullscreenToggleButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported] = useState(
    () =>
      typeof document === "undefined" ||
      Boolean(document.documentElement.requestFullscreen),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setErrorMessage(null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    setErrorMessage(null);

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      setErrorMessage("전체화면 전환을 사용할 수 없습니다.");
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="h-11 rounded-2xl border border-cyan-200/60 bg-cyan-300/12 px-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/22 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500"
        type="button"
        disabled={!isSupported}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? "전체화면 종료" : "전체화면"}
      </button>
      {errorMessage && (
        <p className="max-w-48 text-right text-xs font-bold text-rose-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
