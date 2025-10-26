import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const CCTVGridItem = ({ streamUrl, index }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if HLS is supported
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => {
          console.log(`Camera ${index + 1}: Autoplay prevented, user interaction needed`, err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log(`Camera ${index + 1}: Network error, trying to recover...`);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log(`Camera ${index + 1}: Media error, trying to recover...`);
              hls.recoverMediaError();
              break;
            default:
              console.log(`Camera ${index + 1}: Fatal error, cannot recover`);
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    }
    // For browsers with native HLS support (Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(err => {
          console.log(`Camera ${index + 1}: Autoplay prevented`, err);
        });
      });
    }
  }, [streamUrl, index]);

  return (
    <div className="relative bg-black border border-green-500/30 overflow-hidden group aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        autoPlay
      />
      <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-green-500 text-xs font-mono border border-green-500/50">
        CAM-{String(index + 1).padStart(2, '0')}
      </div>
      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-green-500 text-xs font-mono">
        <span className="animate-pulse">● LIVE</span>
      </div>
      <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

const CCTVGrid = ({ onBack }) => {
  const [cameras, setCameras] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch camera streams from backend
  React.useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch('/api/get_cctv_streams');
        const data = await response.json();
        
        if (data.cameras && data.cameras.length > 0) {
          setCameras(data.cameras);
        } else {
          // If no cameras, show placeholder
          setCameras([{
            uid: '0',
            stream_url: "https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af",
            description: "Demo Camera - No cameras configured yet"
          }]);
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
        // Show placeholder on error
        setCameras([{
          uid: '0',
          stream_url: "https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af",
          description: "Demo Camera - Error loading cameras"
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  return (
    <div className="h-screen bg-black font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-green-500/30 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-green-500 text-xl font-bold tracking-wider">
            ● TRINETRA CCTV SURVEILLANCE GRID
          </h1>
          <div className="text-green-400 text-sm">
            <span className="animate-pulse">● LIVE</span>
            <span className="ml-4">{cameras.length} FEEDS ACTIVE</span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-green-500 hover:text-green-400 border border-green-500 px-4 py-2 transition-all hover:bg-green-500/10"
        >
          [BACK TO TERMINAL]
        </button>
      </div>

      {/* Grid Container with Smooth Scrolling */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-black">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-green-500 text-xl animate-pulse">LOADING CAMERA FEEDS...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {cameras.map((camera, index) => (
                <CCTVGridItem
                  key={camera.uid || index}
                  streamUrl={camera.stream_url}
                  index={index}
                />
              ))}
            </div>
            
            {/* Spacer for more cameras (demonstrates scrolling) */}
            <div className="h-4"></div>
          </>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-black border-t border-green-500/30 p-2 text-green-500 text-xs font-mono flex justify-between items-center">
        <div>
          <span className="text-green-400">SYSTEM STATUS:</span> OPERATIONAL
        </div>
        <div>
          <span className="text-green-400">GRID:</span> 3×3 | <span className="text-green-400">QUALITY:</span> HD
        </div>
        <div>
          <span className="text-green-400">NETWORK:</span> <span className="animate-pulse">● CONNECTED</span>
        </div>
      </div>
    </div>
  );
};

export default CCTVGrid;
