# Quick Start Guide

## Step 1: Install Dependencies

Open your terminal and run:

```bash
cd /Users/joker2307/CascadeProjects/splitwise
pip install -r requirements.txt
```

## Step 2: Basic Usage

### When you have a CCTV webpage URL:

```bash
python cctv_analyzer.py "PASTE_YOUR_URL_HERE"
```

This will:
- Analyze the webpage
- Find all video/stream URLs
- Identify the streaming protocol
- Show you detailed information

### To actually VIEW the stream:

```bash
python cctv_analyzer.py "PASTE_YOUR_URL_HERE" --test
```

## Step 3: Understanding the Output

The script will show you:

```
============================================================
Analyzing URL: https://example.com/camera
============================================================

✓ Webpage fetched successfully!

Searching for video sources...

Found 1 <video> tag(s):
  [1] https://example.com/stream.m3u8

============================================================
ANALYSIS RESULTS
============================================================

Stream #1:
  URL: https://example.com/stream.m3u8
  Protocol: HLS
  Description: HTTP Live Streaming - Apple's streaming protocol
```

## Step 4: What to Do Next

### If streams are found:
- Copy the stream URL
- Use `--test` flag to view it
- Or use the URL in VLC/other players

### If no streams are found:
1. **Check browser DevTools:**
   - Open the CCTV page in Chrome/Firefox
   - Press F12 → Network tab
   - Reload the page
   - Look for `.m3u8`, `.mpd`, or video files
   - Copy that URL and use it directly

2. **Try the direct URL:**
   ```bash
   python cctv_analyzer.py "rtsp://camera-ip:554/stream" --test
   ```

## Common URL Formats

### RTSP (IP Cameras)
```
rtsp://192.168.1.100:554/stream
rtsp://username:password@192.168.1.100:554/stream
rtsp://192.168.1.64:554/cam/realmonitor?channel=1&subtype=0
```

### HLS (Web streams)
```
https://example.com/stream.m3u8
https://example.com/live/playlist.m3u8
```

### MJPEG
```
http://192.168.1.100:8080/video.mjpeg
http://192.168.1.100/mjpeg/1
```

### HTTP/HTTPS
```
https://example.com/camera/feed
http://192.168.1.100:8080/video
```

## Real-World Example

Let's say you have a webpage: `https://mycamera.com/live`

### Step 1: Analyze
```bash
python cctv_analyzer.py "https://mycamera.com/live"
```

### Step 2: View results
The script finds: `https://mycamera.com/stream.m3u8`

### Step 3: Test the stream
```bash
python cctv_analyzer.py "https://mycamera.com/live" --test
```

### Step 4: View the video
A window opens showing the live feed!
- Press 'q' to quit

## Troubleshooting

### "No streams found"
- The stream is loaded via JavaScript
- Use browser DevTools (F12) → Network tab
- Look for video requests manually

### "Failed to open stream"
- Check if URL is accessible in browser/VLC
- Verify authentication credentials
- Check firewall/network settings

### "Permission denied"
- You may not have authorization
- Check with the camera/stream owner

## Tips

1. **Always test in VLC first** - If it works in VLC, it should work here
2. **Check authentication** - Many cameras need username/password
3. **Try different URLs** - Cameras often have multiple stream URLs
4. **Check network** - Ensure you're on the same network for local cameras

## Need Help?

Run the script with `-h` for help:
```bash
python cctv_analyzer.py -h
```

## Example Commands

```bash
# Just analyze
python cctv_analyzer.py "https://example.com/camera"

# Analyze and test
python cctv_analyzer.py "https://example.com/camera" --test

# Test specific stream (if multiple found)
python cctv_analyzer.py "https://example.com/camera" --test --stream-index 0

# Direct RTSP
python cctv_analyzer.py "rtsp://192.168.1.100:554/stream" --test
```
