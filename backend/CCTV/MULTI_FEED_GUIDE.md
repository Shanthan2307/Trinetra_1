# Multi-Feed CCTV Viewer Guide
## Display Up to 12+ Streams in a Grid Pattern

I've created a complete system to find M3U8 streams from multiple URLs and display them all in a grid!

---

## 🎯 Quick Start (3 Steps)

### Step 1: Find Stream URLs

You have **3 ways** to find stream URLs:

#### **Option A: Interactive Mode** (Easiest)
```bash
source venv/bin/activate
python batch_analyzer.py --interactive
```
Then paste your CCTV webpage URLs one by one!

#### **Option B: From File**
```bash
# 1. Add URLs to urls.txt file (one per line)
nano urls.txt

# 2. Run analyzer
source venv/bin/activate
python batch_analyzer.py --file urls.txt
```

#### **Option C: Command Line**
```bash
source venv/bin/activate
python batch_analyzer.py "URL1" "URL2" "URL3"
```

### Step 2: View All Streams in Grid

The analyzer automatically creates `multi_feed_viewer.html` with all found streams!

```bash
open multi_feed_viewer.html
```

Or use the customizable grid viewer:
```bash
open multi_grid_viewer.html
```

### Step 3: Enjoy!

All your streams will load in a beautiful grid layout! 🎥

---

## 📋 Complete Workflow Example

Let's say you want to view 12 different CCTV cameras:

### **Method 1: Interactive (Recommended)**

```bash
cd /Users/joker2307/CascadeProjects/splitwise
source venv/bin/activate
python batch_analyzer.py --interactive
```

**Then paste your URLs:**
```
URL: https://camguide.net/usa/california/san-francisco/tennis/
  ✓ Added (1 total)
URL: https://example.com/camera2
  ✓ Added (2 total)
URL: https://example.com/camera3
  ✓ Added (3 total)
...
URL: [Press Enter twice when done]
```

**The script will:**
1. ✓ Analyze all URLs
2. ✓ Find M3U8 stream links
3. ✓ Create `multi_feed_viewer.html`
4. ✓ Open it automatically!

### **Method 2: Using File**

```bash
# 1. Edit urls.txt and add your URLs
nano urls.txt
```

Add your URLs:
```
https://camguide.net/usa/california/san-francisco/tennis/
https://camguide.net/usa/california/san-francisco/pacifica/
https://example.com/camera3
https://example.com/camera4
# ... up to 12 or more
```

```bash
# 2. Run batch analyzer
source venv/bin/activate
python batch_analyzer.py --file urls.txt

# 3. Open the generated viewer
open multi_feed_viewer.html
```

---

## 🎨 Features

### Multi-Grid Viewer (`multi_grid_viewer.html`)

**Features:**
- ✅ **Add streams dynamically** - Click "+ Add Stream"
- ✅ **Grid layouts** - Auto, 2×2, 3×3, 4×4
- ✅ **Individual controls** - Each stream has its own controls
- ✅ **Delete streams** - Remove streams you don't need
- ✅ **Auto-reconnect** - Handles errors gracefully
- ✅ **Fullscreen mode** - Fullscreen any stream
- ✅ **Responsive** - Works on desktop, tablet, mobile

**How to Use:**
1. Open `multi_grid_viewer.html`
2. Click "+ Add Stream"
3. Paste M3U8 URL
4. Click "Add Stream"
5. Repeat for all your cameras!

**Pre-loaded:**
- Tennis Courts stream is already added as an example

### Batch-Generated Viewer (`multi_feed_viewer.html`)

**Features:**
- ✅ **Auto-generated** from batch analyzer
- ✅ **All streams pre-loaded** - No manual setup
- ✅ **Clean interface** - Optimized for viewing
- ✅ **Grid layout** - Automatically arranged
- ✅ **Individual reloads** - Reload any stream
- ✅ **Fullscreen support** - Per stream

---

## 🔧 Advanced Usage

### Export to JSON

```bash
python batch_analyzer.py --file urls.txt --json streams.json
```

**Output (`streams.json`):**
```json
{
  "total_streams": 3,
  "streams": [
    {
      "source_url": "https://example.com/camera1",
      "stream_url": "https://stream.example.com/...m3u8",
      "protocol": "HLS"
    },
    ...
  ]
}
```

### Custom HTML Output

```bash
python batch_analyzer.py --file urls.txt --html my_cameras.html
```

### Analyze Single URL

```bash
python batch_analyzer.py "https://camguide.net/usa/california/san-francisco/tennis/"
```

---

## 📐 Grid Layouts

The grid automatically adjusts based on number of streams:

| Streams | Layout | Columns |
|---------|--------|---------|
| 1-4 | 2×2 | 2 |
| 5-9 | 3×3 | 3 |
| 10-16 | 4×4 | 4 |
| 17+ | Auto | Responsive |

**Manual Control:**
Click the layout buttons: `Auto`, `2×2`, `3×3`, `4×4`

---

## 🎥 Finding More Camera Streams

### Where to Find CCTV Feeds:

1. **Public Webcam Sites:**
   - camguide.net
   - webcamtaxi.com
   - insecam.org
   - worldcam.eu

2. **City/Traffic Cameras:**
   - Local government websites
   - DOT (Department of Transportation) cameras
   - Weather station cameras

3. **Your Own Cameras:**
   - IP camera web interfaces
   - NVR/DVR systems
   - Security camera systems

### How to Find the M3U8 URL:

1. Open the CCTV webpage
2. Press **F12** (DevTools)
3. Go to **Network** tab
4. Filter by: `m3u8`
5. Reload the page
6. Copy the `.m3u8` URL
7. Paste into batch analyzer!

---

## 💡 Tips & Tricks

### 1. Start with Known URLs

Use the included Tennis Courts stream as a test:
```
https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af
```

### 2. Mix Protocols

You can mix different types:
- HLS (.m3u8)
- RTSP (rtsp://)
- HTTP (direct video files)

### 3. Organize by Location

Name your streams clearly:
- "Camera 1 - Front Door"
- "Camera 2 - Parking Lot"
- "Camera 3 - Back Entrance"

### 4. Use Grid Layouts

- **2×2** - For 4 main cameras
- **3×3** - For 6-9 cameras
- **4×4** - For 10-16 cameras
- **Auto** - For any number

### 5. Performance

For best performance:
- Close unused tabs
- Use hardware acceleration in browser
- Limit to 12 streams max on regular computers
- Use 4-6 streams on older hardware

---

## 🖥️ System Requirements

**Minimum:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- 4GB RAM
- Decent internet connection (10+ Mbps)
- Can handle: 4-6 streams

**Recommended:**
- 8GB+ RAM
- Fast internet (50+ Mbps)
- Recent CPU (2020+)
- Can handle: 12-16 streams

**Optimal:**
- 16GB+ RAM
- Gigabit internet
- Powerful CPU/GPU
- Can handle: 20+ streams

---

## 📱 Mobile Support

The viewers work on mobile devices:
- iOS Safari
- Android Chrome
- Responsive layouts
- Touch controls

**Limitations:**
- Fewer simultaneous streams (2-4 recommended)
- Higher battery usage
- May need WiFi for multiple streams

---

## 🔍 Troubleshooting

### No Streams Found?

**Problem:** Batch analyzer finds no M3U8 URLs

**Solutions:**
1. Use browser DevTools to find URLs manually
2. Check if JavaScript is loading the streams
3. Look for iframes embedding other pages
4. Try the direct stream URL if you have it

### Streams Won't Load?

**Problem:** Video player shows "Error loading stream"

**Solutions:**
1. Click the "Reload" button
2. Check if URL is still valid (test in VLC)
3. Verify network connectivity
4. Try opening in incognito mode
5. Check browser console for errors (F12)

### Too Many Streams = Lag?

**Problem:** Browser becomes slow/laggy

**Solutions:**
1. Reduce number of simultaneous streams
2. Use smaller grid layout (2×2 instead of 4×4)
3. Close other tabs/applications
4. Use a more powerful computer
5. Lower video quality if possible

### Streams Keep Buffering?

**Problem:** Constant buffering/gaps

**Solutions:**
1. Check internet speed
2. Reduce number of streams
3. Use wired connection instead of WiFi
4. Close bandwidth-heavy applications
5. The viewers have auto-reconnect built-in

---

## 📊 Example Scenarios

### Scenario 1: Home Security (4 cameras)

```bash
# urls.txt
https://my-camera1.example.com
https://my-camera2.example.com
https://my-camera3.example.com
https://my-camera4.example.com
```

**Layout:** 2×2 grid  
**Perfect for:** Home monitoring

### Scenario 2: Office Building (9 cameras)

```bash
python batch_analyzer.py --interactive
# Paste 9 camera URLs
```

**Layout:** 3×3 grid  
**Perfect for:** Small office monitoring

### Scenario 3: Large Facility (16 cameras)

**Layout:** 4×4 grid  
**Perfect for:** Warehouse, campus, large building

### Scenario 4: Mixed Sources (12 cameras)

- 3 from camguide.net
- 4 from your IP cameras
- 3 from traffic cameras
- 2 from weather cams

**Layout:** Auto-fit  
**Perfect for:** Mixed monitoring needs

---

## 🎬 Quick Reference Commands

### Find Streams
```bash
# Interactive
python batch_analyzer.py --interactive

# From file
python batch_analyzer.py --file urls.txt

# Direct URLs
python batch_analyzer.py "URL1" "URL2" "URL3"
```

### Open Viewers
```bash
# Auto-generated (after batch analyzer)
open multi_feed_viewer.html

# Customizable grid
open multi_grid_viewer.html
```

### Single Stream Analysis
```bash
python cctv_analyzer.py "URL"
```

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `batch_analyzer.py` | Find M3U8 from multiple URLs |
| `multi_grid_viewer.html` | Customizable grid viewer |
| `multi_feed_viewer.html` | Auto-generated from batch |
| `urls.txt` | Your URL list |
| `streams.json` | Exported stream data |

---

## 🎓 Summary

You now have a **complete multi-feed CCTV system**:

✅ **Batch Analyzer** - Find M3U8 URLs from multiple webpages  
✅ **Multi-Grid Viewer** - Display up to 12+ streams  
✅ **Auto-reconnection** - Handles errors gracefully  
✅ **Flexible layouts** - 2×2, 3×3, 4×4, Auto  
✅ **Easy to use** - Paste URLs and go!  

**Start now:**
```bash
cd /Users/joker2307/CascadeProjects/splitwise
source venv/bin/activate
python batch_analyzer.py --interactive
```

Then paste your CCTV URLs and watch them all in a beautiful grid! 🎥

---

*Multi-Feed CCTV Viewer - Built for monitoring multiple streams simultaneously*
