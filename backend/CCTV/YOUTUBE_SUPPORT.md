# 🎥 YouTube Live Stream Support

## ✅ YouTube Support Added!

The multi-feed viewer now supports **YouTube live streams and videos** alongside M3U8/HLS streams!

---

## 🚀 How to Add YouTube Streams

### Method 1: Direct in Grid Viewer

1. **Open the grid viewer** (already running!)
2. Click **"+ Add Stream"**
3. Paste your **YouTube URL**
4. Give it a name (e.g., "Security Camera Live")
5. Click **"Add Stream"**

### Method 2: Batch Analyzer

```bash
source venv/bin/activate
python batch_analyzer.py --interactive
```

Then paste YouTube URLs:
```
URL: https://www.youtube.com/watch?v=VIDEO_ID
  ✓ Found: YouTube Live Stream
```

---

## 📋 Supported YouTube URL Formats

The viewer automatically detects and handles all YouTube URL formats:

### Regular Watch URLs
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtube.com/watch?v=dQw4w9WgXcQ
```

### Short URLs
```
https://youtu.be/dQw4w9WgXcQ
```

### Embed URLs
```
https://www.youtube.com/embed/dQw4w9WgXcQ
```

### Live URLs
```
https://www.youtube.com/live/dQw4w9WgXcQ
```

### Mobile URLs
```
https://m.youtube.com/watch?v=dQw4w9WgXcQ
```

---

## 🎬 Example Use Cases

### Security Camera on YouTube Live

Many security cameras stream to YouTube Live:

```
1. Copy the YouTube Live URL
2. Click "+ Add Stream"
3. Paste: https://www.youtube.com/watch?v=YOUR_STREAM_ID
4. Name it: "Front Entrance - Live"
5. Add Stream!
```

### Mix YouTube with M3U8 Streams

You can display both in the same grid:

**Example Setup:**
- Stream 1: M3U8 - Tennis Courts (already loaded)
- Stream 2: YouTube - Traffic Camera Live
- Stream 3: M3U8 - Parking Lot Camera
- Stream 4: YouTube - Weather Cam Live
- Stream 5-12: More cameras...

---

## 💡 Finding YouTube Live Streams

### Public Live Cameras on YouTube

Search YouTube for:
- "live camera [city name]"
- "live traffic camera"
- "live beach camera"
- "live security camera"
- "live webcam"

### Your Own YouTube Live Stream

If you're streaming from your camera to YouTube:
1. Start your YouTube Live stream
2. Copy the watch URL
3. Add it to the grid viewer!

---

## 🎨 Features for YouTube Streams

✅ **Auto-detection** - Automatically identifies YouTube URLs  
✅ **All URL formats** - Works with watch, embed, short links  
✅ **Live & recorded** - Works with both live and regular videos  
✅ **Grid display** - Shows alongside other streams  
✅ **Controls** - Fullscreen, reload work perfectly  
✅ **No buffering** - YouTube handles all streaming  

---

## 🔧 How It Works

### URL Detection

The viewer automatically detects YouTube URLs:

```javascript
if (url.includes('youtube.com') || url.includes('youtu.be')) {
    protocol = 'YouTube';
}
```

### Video ID Extraction

Extracts video ID from any format:

```javascript
// From: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// Extracts: dQw4w9WgXcQ
```

### Embed Generation

Creates proper YouTube embed:

```javascript
// Converts to:
https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1
```

---

## 📊 Comparison: YouTube vs M3U8

| Feature | YouTube | M3U8/HLS |
|---------|---------|----------|
| Setup | Paste URL | Find M3U8 link |
| Streaming | YouTube handles | HLS.js handles |
| Quality | Automatic | Fixed |
| Buffering | YouTube's system | 30-60s buffer |
| Controls | YouTube player | HTML5 video |
| Best For | Public cameras | Direct streams |

---

## 💻 Example Configurations

### Home Security (4 cameras)

```
Stream 1: M3U8 - Front Door Camera
Stream 2: M3U8 - Back Door Camera  
Stream 3: YouTube Live - Garage Camera
Stream 4: M3U8 - Driveway Camera
```

### Public Monitoring (9 cameras)

```
Stream 1: M3U8 - Tennis Courts
Stream 2: YouTube - Times Square Live
Stream 3: YouTube - Venice Beach Cam
Stream 4: M3U8 - Local Traffic Cam
Stream 5: YouTube - Tokyo Shibuya Live
Stream 6: M3U8 - Office Lobby
Stream 7: YouTube - Northern Lights Cam
Stream 8: M3U8 - Warehouse
Stream 9: YouTube - Wildlife Camera
```

### Mixed Setup (12 cameras)

```
Your cameras: M3U8 streams (8 cameras)
Public YouTube: Live streams (4 cameras)
Layout: 4×4 grid
```

---

## 🎯 Quick Start Examples

### Add a YouTube Live Stream

**URL to try:**
```
https://www.youtube.com/watch?v=LIVESTREAM_ID
```

**Steps:**
1. Open multi_grid_viewer.html (already open!)
2. Click "+ Add Stream"
3. Paste YouTube URL
4. Name it
5. Click "Add Stream"

### Batch Add Multiple YouTube Streams

```bash
source venv/bin/activate
python batch_analyzer.py --interactive
```

**Paste:**
```
URL: https://www.youtube.com/watch?v=stream1
URL: https://www.youtube.com/watch?v=stream2  
URL: https://www.youtube.com/watch?v=stream3
...
```

---

## 🔍 Troubleshooting

### YouTube Stream Won't Load?

**Problem:** Blank iframe or "Invalid YouTube URL"

**Solutions:**
1. Verify the URL works in a regular browser
2. Check if video is private/unlisted (must be public)
3. Try the full watch URL format
4. Check if video/stream exists
5. Clear browser cache and reload

### Video Shows "Video Unavailable"?

**Problem:** YouTube error in iframe

**Possible Reasons:**
- Video is private or deleted
- Live stream ended
- Region restrictions
- Embedding disabled by owner
- Age-restricted content

**Solutions:**
- Use a different video/stream
- Check video privacy settings
- Try a public live camera stream

### Can't Go Fullscreen?

**Problem:** Fullscreen button doesn't work

**Solution:**
- Click fullscreen button in the grid controls
- Or use browser's fullscreen (F11)
- YouTube player has its own fullscreen button

---

## 📱 Mobile Support

YouTube streams work on mobile devices:
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Touch controls
- ✅ YouTube app integration (may open in app)

---

## 🌟 Pro Tips

1. **Mix Sources** - Combine M3U8 and YouTube for best coverage
2. **Name Clearly** - Use descriptive names for each stream
3. **Test First** - Verify YouTube URL works before adding
4. **Public Streams** - Search for "live camera" on YouTube
5. **Grid Layout** - Use 2×2 or 3×3 for optimal viewing
6. **Muted Start** - Streams start muted to prevent audio chaos

---

## 📚 Supported Stream Types

Your multi-feed viewer now supports:

| Type | Example | Protocol Badge |
|------|---------|----------------|
| HLS | https://...m3u8 | HLS |
| YouTube | youtube.com/watch?v=... | YouTube |
| RTSP | rtsp://camera:554/stream | RTSP |
| MJPEG | http://...video.mjpeg | MJPEG |
| HTTP | http://...video.mp4 | HTTP |

---

## 🎓 Summary

✅ **YouTube support added** - Paste any YouTube URL  
✅ **Auto-detection** - Recognizes all YouTube formats  
✅ **Mixed viewing** - YouTube + M3U8 in same grid  
✅ **Easy setup** - Just paste the URL  
✅ **Full features** - Fullscreen, reload, delete all work  

**Try it now:**
1. Grid viewer is already open
2. Click "+ Add Stream"
3. Paste a YouTube live stream URL
4. Watch it alongside your other cameras!

---

## 🔗 Finding YouTube Live Cameras

**Search terms to try:**
- "live camera [city name]"
- "24/7 live camera"
- "live traffic camera"
- "live security camera feed"
- "live webcam"
- "live streaming camera"

**Popular channels:**
- EarthCam
- Webcam channels for major cities
- Traffic departments
- Weather stations
- Wildlife cameras

---

**YouTube live streaming is now fully integrated into your multi-feed CCTV system!** 🎥

Start adding YouTube streams to your grid right now! 📺
