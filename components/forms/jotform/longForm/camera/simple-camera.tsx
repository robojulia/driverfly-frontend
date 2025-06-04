import React, { useRef, useState, useEffect } from 'react';
import { Button, Row, Alert, Spinner } from 'react-bootstrap';
import styles from '../../../../../styles/digitalhiringapp.module.css';

interface SimpleCameraProps {
  onCapture: (imageData: { base64: string; blob: Blob }) => void;
}

export function SimpleCamera({ onCapture }: SimpleCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleVideoError = (e: any) => {
    console.error('Video error:', e);
    setError('Failed to load video stream');
    setIsLoading(false);
  };

  const handleCanPlay = () => {
    console.log('Video can play now');
    if (videoRef.current) {
      console.log(
        'Video dimensions:',
        videoRef.current.videoWidth,
        'x',
        videoRef.current.videoHeight
      );
    }
    setIsLoading(false);
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setIsLoading(true);
      setError(null);

      // First check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // List available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices.length);

      const constraints = {
        video: {
          facingMode: 'user',
          width: { min: 320, ideal: 640, max: 1280 },
          height: { min: 240, ideal: 480, max: 720 },
        },
        audio: false,
      };

      console.log('Requesting camera with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted');

      if (!videoRef.current) {
        throw new Error('Video element not initialized');
      }

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsLoading(false);

      // Force play the video
      try {
        await videoRef.current.play();
        console.log('Video playback started');
      } catch (playError) {
        console.error('Error playing video:', playError);
        throw new Error('Failed to play video stream');
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start camera');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        console.log('Cleaning up camera stream');
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log('Track stopped:', track.label);
        });
      }
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Failed to get canvas context');
      return;
    }

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    console.log('Taking photo with dimensions:', canvas.width, 'x', canvas.height);

    try {
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Photo captured successfully');
            onCapture({
              base64: base64.split(',')[1],
              blob: blob,
            });
          } else {
            console.error('Failed to create blob from canvas');
            setError('Failed to process captured image');
          }
        },
        'image/jpeg',
        0.8
      );
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo');
    }
  };

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <p>{error}</p>
        <Button
          variant="outline-primary"
          className="mt-2"
          onClick={() => {
            setError(null);
            startCamera();
          }}
        >
          Retry Camera
        </Button>
      </Alert>
    );
  }

  return (
    <div className={styles.camera_container_main}>
      <div className={styles.camera_container}>
        {isLoading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
            <div className="text-center text-white">
              <Spinner animation="border" variant="light" />
              <p className="mt-2">Starting camera...</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={handleCanPlay}
          onError={handleVideoError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
          }}
        />
        <Button
          className={styles.capture_btn}
          onClick={takePhoto}
          disabled={!stream || isLoading}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          {isLoading ? 'Initializing...' : 'Capture'}
        </Button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
