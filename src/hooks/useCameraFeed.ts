import { useState, useEffect, useRef } from 'react';

export function useCameraFeed() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isSimulatedFeed, setIsSimulatedFeed] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function getDevices() {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
          setDevices(videoInputs);
          if (videoInputs.length > 0) {
            setSelectedDeviceId(videoInputs[0].deviceId);
          }
        } catch {
          setIsSimulatedFeed(true);
        }
      }
    }
    getDevices();
  }, []);

  const startCamera = async () => {
    if (!selectedDeviceId) {
      setIsSimulatedFeed(true);
      setIsStreaming(true);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: { deviceId: { exact: selectedDeviceId } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsSimulatedFeed(false);
      setIsStreaming(true);
    } catch {
      // Fallback to simulated camera feed if real webcam is unavailable or permission denied
      setIsSimulatedFeed(true);
      setIsStreaming(true);
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
    setIsStreaming(false);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isStreaming,
    isSimulatedFeed,
    isRecording,
    videoRef,
    startCamera,
    stopCamera,
    toggleRecording,
  };
}
