import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFCanvasViewer({ url }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const pdf = await getDocument(url).promise;
        const page = await pdf.getPage(1);

        const containerWidth = containerRef.current?.offsetWidth || 600;
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(containerWidth / viewport.width, 1.2); // clamp max scale

        const scaledViewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        await page.render({ canvasContext: context, viewport: scaledViewport })
          .promise;
      } catch (err) {
        console.error("PDF rendering failed:", err);
        setError(true);
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto rounded-md border shadow-md p-4"
    >
      <canvas ref={canvasRef} className="mx-auto block max-w-full h-auto" />
      <p className="text-sm text-center text-gray-500 mt-2">
        {error ? (
          <>
            PDF rendering failed.{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline"
            >
              Click to view or download
            </a>
            .
          </>
        ) : (
          <>
            If the document doesn’t render,{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              click here to view or download
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}
