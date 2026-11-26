// components/ui/ImageCropModal.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper, { Area } from "react-easy-crop";
import { X, Check, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

interface Props {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  cropShape?: "round" | "rect"; // <-- এই লাইনটি যোগ করা হয়েছে
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context failed");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], `avatar-${Date.now()}.webp`, {
          type: "image/webp",
        });
        resolve(file);
      },
      "image/webp",
      0.9,
    );
  });
}

export default function ImageCropModal({
  imageSrc,
  onClose,
  onCropComplete,
  cropShape = "round", // <-- ডিফল্ট "round", আর লোগোর জন্য "rect" নেবে
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onCropDone = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      setProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setProcessing(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-neutral-300 rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
            Adjust &amp; Crop Photo (1:1)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-950 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-72 sm:h-80 bg-neutral-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={cropShape}
            showGrid={cropShape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropDone}
          />
        </div>

        {/* Zoom Control & Actions */}
        <div className="p-4 space-y-4 bg-white">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-neutral-500 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-neutral-950 cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-neutral-500 shrink-0" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-3.5 py-2 border border-neutral-300 text-xs font-mono uppercase text-neutral-700 hover:bg-neutral-100 rounded-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              disabled={processing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono uppercase rounded-xs cursor-pointer"
            >
              {processing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Cropping...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Crop &amp; Upload</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
