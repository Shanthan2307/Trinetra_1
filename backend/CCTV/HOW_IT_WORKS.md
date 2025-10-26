# How CCTV Feed Analysis Works

## Overview

This tool helps you understand how CCTV feeds work and how to access them. When you paste a URL, the script analyzes it to find video streams and shows you how to connect to them.

## Understanding CCTV Streaming

### What Happens When You Paste a URL?

1. **URL Type Detection**
   - The script first checks if your URL is a direct stream (RTSP, HLS, etc.)
   - Or if it's a webpage that embeds a stream

2. **For Webpages:**
   - Fetches the HTML content
   - Parses for video elements (`<video>`, `<source>`, `<iframe>`)
   - Searches the page source for common stream patterns

3. **For Direct Streams:**
   - Identifies the protocol (RTSP, HLS, MJPEG, etc.)
   - Provides information about how that protocol works

## Common Streaming Protocols

### 1. RTSP (Real-Time Streaming Protocol)
**What it is:** Standard protocol for IP cameras

**Format:** `rtsp://[username]:[password]@[ip]:[port]/[path]`

**Example:** `rtsp://admin:12345@192.168.1.100:554/stream`

**How it works:**
- Uses TCP/UDP for low-latency streaming
- Default port: 554
- Requires network access to camera
- Often needs authentication

**When to use:**
- Local network IP cameras
- DVR/NVR systems
- Real-time monitoring

### 2. HLS (HTTP Live Streaming)
**What it is:** Apple's streaming protocol, web-friendly

**Format:** URLs ending in `.m3u8`

**Example:** `https://example.com/stream.m3u8`

**How it works:**
- Breaks video into small chunks
- Creates a playlist file (.m3u8)
- Downloads chunks over HTTP
- Can adapt quality based on bandwidth

**When to use:**
- Web-based CCTV viewers
- Public streams
- Cloud-hosted cameras

### 3. MJPEG (Motion JPEG)
**What it is:** Stream of JPEG images

**Format:** Usually HTTP with `/mjpeg` or `/video.mjpeg`

**Example:** `http://192.168.1.100:8080/video.mjpeg`

**How it works:**
- Sends continuous JPEG images
- High bandwidth usage
- Simple but effective
- Good browser compatibility

**When to use:**
- Simple webcams
- Older IP cameras
- Local network viewing

### 4. HTTP/MP4
**What it is:** Progressive download or streaming

**Format:** Standard HTTP URL to video file

**Example:** `https://example.com/video.mp4`

**How it works:**
- Downloads video progressively
- Can start playing before full download
- Uses standard web protocols

**When to use:**
- Recorded footage
- Static video files
- Web-hosted content

## How the Script Works Internally

### Phase 1: Analysis

```python
# The script does this:
1. Takes your URL as input
2. Checks if it's a direct stream
   - Looks for RTSP://, .m3u8, etc.
3. If not direct, fetches webpage
4. Parses HTML for video sources
5. Uses regex to find stream URLs
```

### Phase 2: Protocol Detection

```python
# For each found URL:
1. Check protocol prefix (rtsp://, http://, etc.)
2. Check file extension (.m3u8, .mpd, .mjpeg)
3. Determine streaming method
4. Provide description and details
```

### Phase 3: Stream Testing

```python
# When you use --test flag:
1. Opens stream with OpenCV
2. Attempts to read video frames
3. Displays in window with info overlay
4. Shows FPS and frame count
5. Handles errors with diagnostics
```

## Real-World Workflow

### Scenario 1: You Have a Camera's Web Interface

**Example:** Your IP camera is at `http://192.168.1.100`

**Steps:**
1. Open the camera's web page in a browser
2. Open DevTools (F12) → Network tab
3. Look for the video stream being loaded
4. You might see: `rtsp://192.168.1.100:554/stream1`
5. Use that URL with the script

**Command:**
```bash
python cctv_analyzer.py "rtsp://192.168.1.100:554/stream1" --test
```

### Scenario 2: You Have a CCTV Webpage

**Example:** `https://security.example.com/camera/lobby`

**Steps:**
1. Run the analyzer on the webpage
```bash
python cctv_analyzer.py "https://security.example.com/camera/lobby"
```

2. The script finds: `https://security.example.com/hls/lobby.m3u8`

3. Test the stream:
```bash
python cctv_analyzer.py "https://security.example.com/hls/lobby.m3u8" --test
```

### Scenario 3: DVR/NVR System

**Example:** You have a DVR at `192.168.1.50`

**Common URLs:**
- Hikvision: `rtsp://admin:pass@192.168.1.50:554/Streaming/Channels/101`
- Dahua: `rtsp://admin:pass@192.168.1.50:554/cam/realmonitor?channel=1&subtype=0`
- General: `rtsp://admin:pass@192.168.1.50:554/stream1`

**Test:**
```bash
python cctv_analyzer.py "rtsp://admin:pass@192.168.1.50:554/stream1" --test
```

## What You Get From the Script

### Information Provided:

1. **Stream URLs** - Exact URLs to access the video
2. **Protocol Type** - What technology is used
3. **Description** - How the protocol works
4. **Accessibility** - Whether stream is accessible
5. **Visual Feedback** - Live display of the feed

### Example Output:

```
============================================================
Analyzing URL: https://example.com/camera
============================================================

✓ Direct stream URL detected!

============================================================
ANALYSIS RESULTS
============================================================

Stream #1:
  URL: https://example.com/stream.m3u8
  Protocol: HLS
  Description: HTTP Live Streaming - Apple's streaming protocol

Tip: Use --test flag to attempt viewing the stream
```

## Common Questions

### Q: Why can't the script find my stream?

**A:** Modern websites often load streams via JavaScript. The HTML parser can't execute JavaScript, so it won't see dynamically-loaded streams.

**Solution:** Use browser DevTools to find the actual stream URL.

### Q: What if the stream needs authentication?

**A:** Include credentials in the URL:
- RTSP: `rtsp://username:password@ip:port/stream`
- HTTP: The script will handle cookies/sessions if they exist

### Q: Can I record the stream?

**A:** Yes! You can modify the script or use tools like:
- `ffmpeg -i "rtsp://..." output.mp4`
- VLC's record function
- OpenCV's VideoWriter

### Q: Is this legal?

**A:** Only access streams you have permission to view. This tool is for:
- Your own cameras
- Authorized security systems
- Public streams you're allowed to access
- Educational purposes

### Q: What about 4K or high-resolution streams?

**A:** The script handles any resolution OpenCV supports. Performance depends on:
- Your computer's processing power
- Network bandwidth
- Stream bitrate

## Technical Details

### How OpenCV Captures Video:

```python
# Behind the scenes:
cap = cv2.VideoCapture(url)  # Opens stream
ret, frame = cap.read()       # Reads one frame
cv2.imshow('Feed', frame)     # Displays frame
```

### Supported by OpenCV:
- RTSP (with FFmpeg)
- HTTP/HTTPS
- MJPEG
- Local files
- HLS (with FFmpeg)

### Network Requirements:
- **RTSP:** Port 554 (TCP/UDP)
- **HTTP/HLS:** Port 80/443 (TCP)
- **Local cameras:** Same subnet access

## Next Steps

1. **Test with your URL:**
   ```bash
   python cctv_analyzer.py "YOUR_URL" --test
   ```

2. **If it doesn't work:**
   - Check browser DevTools
   - Verify credentials
   - Test in VLC first
   - Check network connectivity

3. **For advanced usage:**
   - Modify the script for recording
   - Integrate with motion detection
   - Add multi-camera support
   - Create a dashboard

## Additional Resources

### Testing Tools:
- **VLC Media Player** - Best for testing stream URLs
- **FFmpeg** - Command-line streaming tool
- **Browser DevTools** - Finding stream URLs

### Common Camera Ports:
- 554 - RTSP
- 80/8080 - HTTP/Web interface
- 443 - HTTPS
- 1935 - RTMP

### Useful FFmpeg Commands:
```bash
# Test stream
ffplay "rtsp://camera-url"

# Record stream
ffmpeg -i "rtsp://camera-url" -c copy output.mp4

# Re-stream
ffmpeg -i "rtsp://camera-url" -f mpegts udp://destination:port
```

## Conclusion

This script helps you understand and access CCTV feeds by:
1. Finding stream URLs
2. Identifying protocols
3. Testing connectivity
4. Displaying live feeds

Always ensure you have proper authorization before accessing any camera system!
