import React, { useRef, useEffect, useState } from "react";
import { useViewer } from "../../react-kinesis-webrtc";
import CircularProgress from '@mui/material/CircularProgress';

function VideoFrame({ config }: any) {
  const {
    error,
    peer: { media } = { media: undefined },
  } = useViewer(config);

  const videoRef = useRef<any>();
  const [loading, setLoading] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  // Detect if the user is on an iOS device
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // Assign the peer media stream to a video source
  useEffect(() => {
    if (videoRef.current && media) {
      videoRef.current.srcObject = media;
    }
  }, [media, videoRef]);

  useEffect(() => {
    console.log(error?.message);
    if (error?.message === 'peer disconnected') {
      console.error(error.message);
    }
  }, [error]);

  const handleWaiting = () => {
    setLoading(true);
  };

  const handleCanPlayThrough = () => {
    setLoading(false);
  };

  // Display an error
  if (error) {
    return <p className="text-black">An error occurred: {error.message}</p>;
  }

  if (!media) {
    return (
      <>
        <div>
          <CircularProgress />
          <p className="text-black">Connecting to the camera...</p>
        </div>
      </>
    );
  }

  return (
    <>
 
      <div style={{ position: 'relative' }} >
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          controls
          className="object-fill rounded"
          onWaiting={handleWaiting}
          onCanPlayThrough={handleCanPlayThrough}
        />
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {isIOS && (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            )}
            <p className="text-black">Await the signal from the camera...</p>
          </div>
        )}
      </div>
  
    </>
  );
}

export default VideoFrame;
