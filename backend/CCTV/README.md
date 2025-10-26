# CCTV Feed Analyzer

A Python script to analyze CCTV feed URLs, identify streaming protocols, and display video feeds in real-time.

## Features

- 🔍 **URL Analysis**: Analyzes webpages to find embedded CCTV streams
- 🎥 **Protocol Detection**: Identifies streaming protocols (RTSP, HLS, MJPEG, etc.)
- 📺 **Live Display**: View CCTV feeds in real-time with OpenCV
- 📊 **Stream Info**: Shows FPS, frame count, and protocol details
- 🔧 **Troubleshooting**: Provides helpful debugging information

## Supported Protocols

- **RTSP** (Real-Time Streaming Protocol) - Common for IP cameras
- **HLS** (HTTP Live Streaming) - .m3u8 files
- **RTMP** (Real-Time Messaging Protocol) - Flash streaming
- **MJPEG** (Motion JPEG) - Stream of JPEG images
- **DASH** (Dynamic Adaptive Streaming over HTTP)
- **HTTP/MP4** - Progressive download

## Installation

1. Clone or download this repository

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Analysis

Analyze a URL to find CCTV streams:
```bash
python cctv_analyzer.py https://example.com/camera
```

### Analyze and Display Feed

Analyze and attempt to display the video feed:
```bash
python cctv_analyzer.py https://example.com/camera --test
```

### Direct Stream URL

If you have a direct stream URL (e.g., RTSP, HLS):
```bash
python cctv_analyzer.py rtsp://192.168.1.100:554/stream --test
```

### Test Specific Stream

If multiple streams are found, test a specific one by index:
```bash
python cctv_analyzer.py https://example.com/camera --test --stream-index 1
```

## How It Works

1. **URL Analysis**:
   - Checks if the URL is a direct stream (RTSP, RTMP, .m3u8, etc.)
   - If not, fetches the webpage and parses HTML

2. **Stream Discovery**:
   - Searches for `<video>` and `<source>` tags
   - Identifies `<iframe>` embeds
   - Uses regex to find stream URLs in page source

3. **Protocol Identification**:
   - Analyzes URL patterns and extensions
   - Determines streaming protocol and provides description

4. **Stream Testing**:
   - Uses OpenCV to open and display the stream
   - Shows real-time FPS and frame count
   - Provides error diagnostics if stream fails

## Common Issues & Solutions

### Stream Won't Open

**Problem**: "Failed to open stream"

**Solutions**:
- Verify the URL is correct and accessible
- Check if the stream requires authentication (username/password)
- For RTSP streams, ensure port 554 is not blocked by firewall
- Try accessing the URL in a web browser first

### Authentication Required

For streams requiring authentication, modify the URL format:
```
rtsp://username:password@192.168.1.100:554/stream
```

### JavaScript-Loaded Streams

**Problem**: No streams found on webpage

**Solutions**:
- Open browser DevTools (F12) → Network tab
- Reload the page and look for .m3u8, .mpd, or video requests
- Copy the stream URL and use it directly with this script

### Codec Not Supported

**Problem**: OpenCV can't decode the stream

**Solutions**:
- Install FFmpeg: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux)
- Rebuild OpenCV with FFmpeg support
- Try using VLC or other media player to verify the stream works

## Examples

### Example 1: Public CCTV Feed
```bash
python cctv_analyzer.py https://example.com/public-camera --test
```

### Example 2: IP Camera RTSP Stream
```bash
python cctv_analyzer.py rtsp://admin:password@192.168.1.64:554/cam/realmonitor?channel=1&subtype=0
```

### Example 3: HLS Stream
```bash
python cctv_analyzer.py https://example.com/stream.m3u8 --test
```

## Keyboard Controls

When viewing a stream:
- **q**: Quit the video feed
- **Ctrl+C**: Interrupt the stream

## Privacy & Legal Notice

⚠️ **Important**: Only access CCTV feeds that you have permission to view. Unauthorized access to security cameras may be illegal in your jurisdiction. This tool is for educational and authorized testing purposes only.

## Troubleshooting Tips

1. **Check Network Connectivity**: Ensure you can reach the camera/server
2. **Verify Credentials**: If authentication is required, verify username/password
3. **Test with VLC**: Try opening the stream URL in VLC Media Player
4. **Check Firewall**: Ensure required ports are not blocked
5. **Browser DevTools**: Use browser's Network tab to find actual stream URLs

## Technical Details

### Dependencies
- **requests**: HTTP library for fetching webpages
- **beautifulsoup4**: HTML/XML parsing
- **opencv-python**: Video capture and display

### Stream URL Detection Patterns
- `.m3u8` - HLS playlists
- `.mpd` - DASH manifests  
- `.flv` - Flash video
- `rtsp://` - RTSP protocol
- `rtmp://` - RTMP protocol

## Contributing

Feel free to submit issues or pull requests to improve this tool!

## License

MIT License - Use freely for educational and authorized purposes.
