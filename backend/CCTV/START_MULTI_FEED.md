# 🎥 START HERE - Multi-Feed CCTV System

## ✅ Complete! You Can Now Display 12+ Camera Streams in a Grid!

The **multi-grid viewer** supports **M3U8, YouTube Live, RTSP & more**!

**Now with YouTube Live Stream Support!** 🎬

---

## 🚀 3 Ways to Add More Streams

### **Way 1: Click "+ Add Stream"** (In Browser - Easiest!)

The grid viewer is already open! Just:
1. Click **"+ Add Stream"** button (top right)
2. Paste your **M3U8 or YouTube URL**
3. Give it a name (optional)
4. Click **"Add Stream"**
5. Repeat for all your cameras!

**YouTube Support:** Paste any YouTube live stream or video URL!

**Your Tennis Courts stream is already playing as an example!**

---

### **Way 2: Paste URLs One-by-One** (Interactive)

```bash
cd /Users/joker2307/CascadeProjects/splitwise
./find_and_display.sh
```

Choose **option 1**, then:
- Paste each CCTV webpage URL
- Script finds M3U8 links automatically
- Creates viewer with all streams
- Opens automatically!

---

### **Way 3: Batch Process from File**

```bash
# 1. Add your URLs to urls.txt (one per line)
nano urls.txt

# 2. Run the launcher
./find_and_display.sh
# Choose option 2
```

The script will:
- Analyze all URLs
- Find M3U8 streams
- Create multi_feed_viewer.html
- Open with all streams!

---

## 🎨 Grid Layouts

Click the layout buttons in the viewer:

- **Auto** - Automatically arranges (default)
- **2×2** - Perfect for 4 cameras
- **3×3** - Perfect for 6-9 cameras
- **4×4** - Perfect for 10-16 cameras

---

## 🔍 How to Find M3U8 URLs

### Automatic (Let Script Do It):
```bash
python batch_analyzer.py --interactive
# Paste CCTV webpage URL
# Script extracts M3U8 automatically!
```

### Manual (Browser DevTools):
1. Open CCTV page in Chrome
2. Press **F12**
3. Click **Network** tab
4. Type `m3u8` in filter
5. Reload page
6. Copy the `.m3u8` URL
7. Paste into grid viewer!

---

## 📋 Example: Add 12 Cameras

### Option A: Interactive
```bash
source venv/bin/activate
python batch_analyzer.py --interactive
```

Then paste your 12 CCTV URLs:
```
URL: https://camera1.example.com
  ✓ Added (1 total)
URL: https://camera2.example.com
  ✓ Added (2 total)
...
URL: https://camera12.example.com
  ✓ Added (12 total)
[Press Enter twice]

✓ Found 12 streams!
✓ Created multi_feed_viewer.html
[Opens automatically in browser]
```

### Option B: Manual in Grid Viewer
The grid viewer is already open! Just:
1. Click "+ Add Stream" 12 times
2. Paste each M3U8 URL
3. Done!

---

## ⚡ Quick Commands

```bash
# All-in-one launcher
./find_and_display.sh

# Interactive analyzer
python batch_analyzer.py --interactive

# From file
python batch_analyzer.py --file urls.txt

# Direct URLs
python batch_analyzer.py "URL1" "URL2" "URL3"

# Open grid viewer
open multi_grid_viewer.html
```

---

## 📺 What You Have Now

### Files Created:

**Viewers:**
- ✅ `multi_grid_viewer.html` - Interactive grid (CURRENTLY OPEN!)
- ✅ `multi_feed_viewer.html` - Auto-generated viewer

**Tools:**
- ✅ `batch_analyzer.py` - Find M3U8 from multiple URLs
- ✅ `find_and_display.sh` - One-click launcher
- ✅ `urls.txt` - Template for your URLs

**Documentation:**
- ✅ `MULTI_FEED_GUIDE.md` - Complete guide
- ✅ `MULTI_FEED_README.md` - Detailed docs
- ✅ `START_MULTI_FEED.md` - This file!

---

## 🎯 Features

✅ **Display 12+ streams** simultaneously  
✅ **Grid layouts** - Auto, 2×2, 3×3, 4×4  
✅ **Add/remove streams** dynamically  
✅ **Auto-reconnection** - Handles errors gracefully  
✅ **Individual controls** - Reload, fullscreen per stream  
✅ **30-60s buffer** - Smooth, continuous playback  
✅ **Find M3U8** automatically from webpages  
✅ **Responsive design** - Works on all screens  

---

## 💡 Pro Tips

1. **Start with the grid viewer** (already open) - easiest way
2. **Use batch analyzer** for many cameras - finds M3U8 automatically
3. **Test individual URLs first** - use `python cctv_analyzer.py "URL"`
4. **Save bandwidth** - use 2×2 or 3×3 for fewer streams
5. **Name your streams** - easier to identify cameras

---

## 🎬 Next Steps

### Right Now:
The grid viewer is open with Tennis Courts stream!

### To Add More Cameras:

**Easiest Way:**
1. Click "+ Add Stream" in the open viewer
2. Paste M3U8 URL
3. Click "Add Stream"

**Automatic Way:**
```bash
./find_and_display.sh
# Choose option 1
# Paste CCTV webpage URLs
```

**Batch Way:**
```bash
# Edit urls.txt with your URLs
./find_and_display.sh
# Choose option 2
```

---

## 📞 Summary

You have a **complete professional multi-feed CCTV system**!

**What's Open:** Multi-grid viewer with Tennis Courts stream  
**What You Can Do:** Add up to 12+ more camera streams  
**How:** Click "+ Add Stream" or use batch analyzer  

**Start adding cameras now!** 🎥

---

*Your multi-feed CCTV grid system is ready to use!*
