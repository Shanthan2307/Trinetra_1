# 🎥 Multi-Feed CCTV Viewer - Complete System

## ✅ You Now Have a Professional Multi-Feed CCTV System!

Display **up to 12+ camera streams** simultaneously in a beautiful grid layout with automatic M3U8 detection and continuous playback.

---

## 🚀 QUICKEST START (3 Options)

### **Option 1: One-Click Interactive** ⭐ (Recommended)

```bash
./find_and_display.sh
```

Choose option **1**, then paste your CCTV webpage URLs one by one!

### **Option 2: Direct Grid Viewer** (Already Open!)

The **multi-grid viewer is already running** in your browser with the Tennis Courts stream!

**To add more streams:**
1. Click "+ Add Stream"
2. Paste your M3U8 URL
3. Give it a name
4. Click "Add Stream"
5. Repeat for all cameras!

### **Option 3: Batch Process from File**

```bash
# 1. Add URLs to urls.txt
nano urls.txt

# 2. Run the script
./find_and_display.sh
# Choose option 2
```

---

## 📋 What Just Happened?

I've created a **complete multi-feed CCTV system** with:

### 🔍 **Stream Finder** (`batch_analyzer.py`)
- Analyzes multiple CCTV webpages
- Automatically extracts M3U8 stream URLs
- Supports interactive, file, or command-line input
- Exports to JSON or HTML

### 📺 **Multi-Grid Viewer** (`multi_grid_viewer.html`)
- Display up to 12+ streams simultaneously
- Grid layouts: Auto, 2×2, 3×3, 4×4
- Add/remove streams dynamically
- Individual controls for each stream
- Auto-reconnection and error recovery
- **Already open with Tennis Courts stream!**

### ⚙️ **Auto-Generated Viewer** (`multi_feed_viewer.html`)
- Created automatically by batch analyzer
- All found streams pre-loaded
- Clean, optimized interface
- Perfect for fixed camera setups

---

## 📁 New Files Created

### Ready to Use:
1. **`multi_grid_viewer.html`** ⭐ - Interactive grid viewer (OPEN NOW!)
2. **`batch_analyzer.py`** - Find M3U8 from multiple URLs
3. **`find_and_display.sh`** - One-click launcher
4. **`urls.txt`** - Template for your URLs

### Documentation:
5. **`MULTI_FEED_GUIDE.md`** - Complete usage guide
6. **`MULTI_FEED_README.md`** - This file!

---

## 🎯 How to Use - Step by Step

### **Scenario: You have 12 CCTV camera webpage URLs**

#### Step 1: Choose Your Method

**Method A - Interactive (Easiest):**
```bash
cd /Users/joker2307/CascadeProjects/splitwise
./find_and_display.sh
# Choose option 1
# Paste each URL when prompted
```

**Method B - From File:**
```bash
# Edit urls.txt and add your URLs
nano urls.txt

# Run analyzer
./find_and_display.sh
# Choose option 2
```

**Method C - Manual (Most Control):**
```bash
# The grid viewer is already open!
# Just click "+ Add Stream" and paste M3U8 URLs
```

#### Step 2: Watch All Streams!

All your cameras will display in a beautiful grid layout! 🎥

---

## 💡 Example Workflow

Let's say you want to monitor 6 locations:

### URLs You Have:
```
https://camguide.net/usa/california/san-francisco/tennis/
https://camguide.net/usa/california/san-francisco/pacifica/
https://example.com/office-lobby
https://example.com/parking-lot
https://example.com/warehouse-entrance
https://example.com/back-door
```

### Option A: Interactive Mode

```bash
./find_and_display.sh
# Choose: 1

URL: https://camguide.net/usa/california/san-francisco/tennis/
  ✓ Added (1 total)
URL: https://camguide.net/usa/california/san-francisco/pacifica/
  ✓ Added (2 total)
URL: https://example.com/office-lobby
  ✓ Added (3 total)
# ... continue for all 6

# Press Enter twice when done

# Script automatically:
# - Finds all M3U8 URLs
# - Creates multi_feed_viewer.html
# - Opens it in your browser
# - Shows all 6 streams in a 3×3 grid!
```

### Option B: Using urls.txt

```bash
# 1. Create/edit urls.txt
cat > urls.txt << EOF
https://camguide.net/usa/california/san-francisco/tennis/
https://camguide.net/usa/california/san-francisco/pacifica/
https://example.com/office-lobby
https://example.com/parking-lot
https://example.com/warehouse-entrance
https://example.com/back-door
EOF

# 2. Run analyzer
./find_and_display.sh
# Choose: 2

# 3. Viewer opens automatically with all 6 streams!
```

### Option C: Manual Grid

```bash
# Grid viewer is already open!
# For each camera:
# 1. Click "+ Add Stream"
# 2. Paste M3U8 URL (you found using browser DevTools)
# 3. Name it (e.g., "Office Lobby")
# 4. Click "Add Stream"
```

---

## 🎨 Grid Viewer Features

### Layout Controls
- **Auto** - Automatically arranges streams
- **2×2** - Perfect for 4 cameras
- **3×3** - Perfect for 6-9 cameras  
- **4×4** - Perfect for 10-16 cameras

### Per-Stream Controls
- **⟳ Reload** - Restart individual stream
- **⛶ Fullscreen** - View stream fullscreen
- **✕ Delete** - Remove stream from grid

### Global Controls
- **+ Add Stream** - Add new cameras
- **Clear All** - Remove all streams

### Auto-Features
- ✅ **Auto-reconnection** - Recovers from errors (5 attempts)
- ✅ **Buffer management** - 30-60 second buffer
- ✅ **Error recovery** - Smart codec switching
- ✅ **Responsive** - Works on all screen sizes

---

## 🔍 Finding M3U8 URLs

### Method 1: Use Batch Analyzer (Automatic)

```bash
python batch_analyzer.py --interactive
# Paste CCTV webpage URL
# Script finds M3U8 automatically!
```

### Method 2: Browser DevTools (Manual)

1. Open CCTV webpage in Chrome/Firefox
2. Press **F12** (DevTools)
3. Go to **Network** tab
4. Type `m3u8` in filter box
5. Reload page (**Cmd+R** or **Ctrl+R**)
6. Look for `.m3u8` file
7. Right-click → Copy → Copy URL
8. Paste into grid viewer!

**Example of what you'll find:**
```
https://stream-uc2-charlie.dropcam.com/.../chunklist.m3u8?public=xxxxx
```

---

## 📊 Use Cases

### Home Security (4 cameras)
**Layout:** 2×2  
**Cameras:** Front door, back door, garage, driveway

### Office Building (9 cameras)
**Layout:** 3×3  
**Cameras:** Lobby, each floor, parking, entrances

### Warehouse (12 cameras)
**Layout:** 4×4  
**Cameras:** Loading docks, aisles, entrances, offices

### Mixed Monitoring (varies)
**Layout:** Auto  
**Cameras:** Your cameras + public webcams + traffic cams

---

## 🎬 Quick Commands Reference

### Find & Display (All-in-One)
```bash
./find_and_display.sh
```

### Batch Analyzer
```bash
# Interactive
python batch_analyzer.py --interactive

# From file
python batch_analyzer.py --file urls.txt

# Direct URLs
python batch_analyzer.py "URL1" "URL2" "URL3"

# With export
python batch_analyzer.py --file urls.txt --json streams.json --html viewer.html
```

### Open Viewers
```bash
# Custom grid (add streams manually)
open multi_grid_viewer.html

# Auto-generated (after batch analyzer)
open multi_feed_viewer.html
```

### Single Stream Analysis
```bash
python cctv_analyzer.py "URL"
python cctv_analyzer.py "URL" --test
```

---

## 💻 System Requirements

### For 4-6 Streams:
- **RAM:** 4GB
- **Internet:** 10+ Mbps
- **Browser:** Any modern browser

### For 12 Streams:
- **RAM:** 8GB+
- **Internet:** 50+ Mbps
- **Browser:** Chrome/Firefox (recommended)

### For 16+ Streams:
- **RAM:** 16GB+
- **Internet:** 100+ Mbps
- **CPU:** Recent (2020+)
- **GPU:** Helpful for hardware decoding

---

## 🔧 Troubleshooting

### No M3U8 Found?

**Problem:** Batch analyzer can't find stream URLs

**Solution:**
1. Use browser DevTools to find manually (see above)
2. The webpage may use JavaScript to load streams
3. Look for iframe embeds
4. Try opening the video in a new tab
5. Check browser console for URLs

### Stream Won't Load?

**Problem:** Grid shows "Error loading stream"

**Solution:**
1. Click "Reload" button
2. Verify URL works in VLC: `File → Open Network Stream`
3. Check if authentication is needed
4. Try in incognito mode
5. Check browser console (F12) for errors

### Too Many Streams = Lag?

**Problem:** Browser becomes slow

**Solution:**
1. Reduce number of streams
2. Use smaller grid (2×2 instead of 4×4)
3. Close other tabs
4. Upgrade RAM
5. Use wired connection instead of WiFi

### Streams Keep Buffering?

**Problem:** Constant buffering

**Solution:**
1. Check internet speed (test on fast.com)
2. Reduce simultaneous streams
3. The viewer has 30-60s buffer built-in
4. Auto-reconnect will handle temporary issues
5. Use wired connection

---

## 📚 File Structure

```
/splitwise/
├── batch_analyzer.py          # Find M3U8 from multiple URLs
├── multi_grid_viewer.html     # Interactive grid viewer ⭐
├── multi_feed_viewer.html     # Auto-generated viewer
├── find_and_display.sh        # Quick launcher
├── urls.txt                   # Your URL list
├── MULTI_FEED_GUIDE.md       # Detailed guide
└── MULTI_FEED_README.md      # This file
```

---

## 🎓 Summary

You now have a **complete professional multi-feed CCTV system**!

### What You Can Do:

✅ **Find M3U8 streams** from any CCTV webpage  
✅ **Display 12+ streams** simultaneously  
✅ **Grid layouts** - 2×2, 3×3, 4×4, Auto  
✅ **Add/remove streams** dynamically  
✅ **Auto-reconnection** - Never miss footage  
✅ **Individual controls** - Per-stream management  
✅ **Professional buffering** - No gaps or stuttering  
✅ **Responsive design** - Works on all devices  

### Quick Start Right Now:

1. **Grid viewer is already open!** (Tennis Courts loaded)
2. Click **"+ Add Stream"**
3. Paste your M3U8 URLs
4. Watch all cameras at once!

Or use the one-click launcher:
```bash
./find_and_display.sh
```

---

## 📞 What's Next?

### To add more streams:
1. Find M3U8 URLs using batch analyzer or DevTools
2. Click "+ Add Stream" in grid viewer
3. Paste and name your streams
4. Choose your preferred layout

### To monitor 12 cameras:
```bash
./find_and_display.sh
# Choose option 1
# Paste 12 CCTV webpage URLs
# Viewer opens with all 12 streams in 4×4 grid!
```

### To save your setup:
The grid viewer keeps streams in browser memory. To save permanently:
1. Use batch analyzer to create HTML file
2. Or export to JSON for later use

---

**Your multi-feed CCTV grid system is ready!** 🎥

Open the grid viewer (already running) and start adding your camera streams! 📺

---

*Multi-Feed CCTV Viewer - Display 12+ streams in a professional grid layout*
