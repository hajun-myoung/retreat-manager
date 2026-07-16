"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { MiniGameMedia } from "@/src/types/game";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type MiniGameInstructionViewerProps = {
  media: MiniGameMedia;
  miniGameName: string;
  onClose: () => void;
};

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.2;

export function MiniGameInstructionViewer({
  media,
  miniGameName,
  onClose,
}: MiniGameInstructionViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fitWidth, setFitWidth] = useState(860);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setFitWidth(Math.max(280, Math.floor(entry.contentRect.width - 32)));
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const canGoPrevious = pageNumber > 1;
  const canGoNext = pageCount > 0 && pageNumber < pageCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/88 p-3 text-white backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${miniGameName} 안내 자료`}
    >
      <div className="flex h-full w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border border-white/16 bg-slate-950 shadow-2xl">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/12 bg-white/[0.07] p-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Instructions
            </p>
            <h2 className="truncate text-xl font-black text-white">
              {miniGameName}
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-300">
              {media.label}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              className="h-10 rounded-xl border border-white/18 px-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              disabled={!canGoPrevious}
              onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
            >
              이전
            </button>
            <div className="flex h-10 items-center rounded-xl bg-white/[0.08] px-3 text-sm font-black text-amber-100">
              {pageNumber} / {pageCount || "-"}
            </div>
            <button
              className="h-10 rounded-xl border border-white/18 px-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              disabled={!canGoNext}
              onClick={() =>
                setPageNumber((page) => Math.min(pageCount, page + 1))
              }
            >
              다음
            </button>
            <button
              className="h-10 rounded-xl border border-white/18 px-3 text-sm font-black text-white transition hover:bg-white/10"
              type="button"
              onClick={() =>
                setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))
              }
            >
              축소
            </button>
            <button
              className="h-10 rounded-xl border border-white/18 px-3 text-sm font-black text-white transition hover:bg-white/10"
              type="button"
              onClick={() => setZoom(1)}
            >
              맞춤
            </button>
            <button
              className="h-10 rounded-xl border border-white/18 px-3 text-sm font-black text-white transition hover:bg-white/10"
              type="button"
              onClick={() =>
                setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))
              }
            >
              확대
            </button>
            <button
              className="h-10 rounded-xl bg-rose-300 px-4 text-sm font-black text-slate-950 transition hover:bg-rose-200"
              type="button"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </header>

        <main
          ref={containerRef}
          className="min-h-0 flex-1 overflow-auto bg-slate-900 p-4"
        >
          <Document
            file={media.src}
            className="flex min-h-full justify-center"
            loading={
              <div className="rounded-2xl bg-slate-950/70 p-5 text-sm font-black text-slate-200">
                안내 자료를 불러오는 중...
              </div>
            }
            error={
              <div className="rounded-2xl border border-rose-300/50 bg-rose-500/16 p-5 text-sm font-black text-rose-100">
                안내 자료를 불러오지 못했습니다.
              </div>
            }
            onLoadSuccess={({ numPages }) => {
              setPageCount(numPages);
              setPageNumber((page) => Math.min(page, numPages));
            }}
          >
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={fitWidth * zoom}
            />
          </Document>
        </main>
      </div>
    </div>
  );
}
