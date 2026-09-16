import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Trash2, Upload, Video, AlertCircle } from 'lucide-react';

interface LivePhotoCaptureProps {
  photoUrl?: string;
  onPhotoCaptured: (dataUrl: string | undefined) => void;
}

export const LivePhotoCapture: React.FC<LivePhotoCaptureProps> = ({
  photoUrl,
  onPhotoCaptured,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Live camera not supported in this browser. Please use photo upload.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 480 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera';
      setCameraError(msg.includes('Permission') ? 'Camera permission was denied.' : msg);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - minDim) / 2;
    const startY = (video.videoHeight - minDim) / 2;

    ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    onPhotoCaptured(dataUrl);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 320;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onPhotoCaptured(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">
          Live Member Photo (Optional)
        </label>
        {photoUrl && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Photo Attached
          </span>
        )}
      </div>

      {cameraError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center space-x-2 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{cameraError} You can upload a photo instead.</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-[280px] mx-auto border-2 border-[#1A3EEA] shadow-md flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-4 border-2 border-dashed border-white/60 rounded-full" />
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between space-x-2">
            <button
              type="button"
              onClick={stopCamera}
              className="flex-1 py-2 px-3 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold hover:bg-black/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={captureFrame}
              className="flex-1 py-2 px-3 rounded-xl bg-[#1A3EEA] text-white text-xs font-bold shadow-md hover:bg-[#1534D8] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Snap Photo</span>
            </button>
          </div>
        </div>
      ) : photoUrl ? (
        <div className="p-3 bg-white border border-[#E9ECEF] rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={photoUrl}
                alt="Member preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1A3EEA]/20 shadow-sm"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Live Photo Ready</p>
              <p className="text-[11px] text-[#64748B]">Will appear on member card</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={startCamera}
              title="Retake photo"
              className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E9ECEF] text-[#1A3EEA] hover:bg-[#EBF1FF] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onPhotoCaptured(undefined)}
              title="Remove photo"
              className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E9ECEF] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white border border-dashed border-[#CBD5E1] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Take Member Photo</p>
              <p className="text-[11px] text-[#64748B]">Snap via live webcam or upload photo</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={startCamera}
              className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl bg-[#1A3EEA] hover:bg-[#1534D8] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none h-9 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#EBF1FF] border border-[#E9ECEF] text-[#0F172A] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
