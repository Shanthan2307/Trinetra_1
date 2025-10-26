# 🚀 Quick Start - CCTV .m3u8 Streams

## Install & Run (2 steps)

### 1. Install Dependencies
```bash
cd /Users/joker2307/Desktop/unagi/backend
./install_dependencies.sh
```

### 2. Start Backend
```bash
python3 main.py
```

---

## Add .m3u8 Camera (3 steps)

### Step 1: Open Camera Interface
- Click `[INIT-CAMERA-PROTOCOL]` in terminal

### Step 2: Analyze Stream
- Enter .m3u8 URL: `https://example.com/stream.m3u8`
- Click `[ANALYZE URL]`
- Wait for: ✓ "Found 1 stream(s)! (HLS) ✓ Validated"

### Step 3: Add Camera
- Coordinates: `37.7749,-122.4194`
- Description: "Camera Name"
- Click `[COMMIT]`

---

## View Live Streams

Click `[OPEN-CCTV]` → See all cameras in grid view!

---

## Test URL

```
https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af
```

---

## ✅ What's Fixed

- ✅ .m3u8 validation before adding
- ✅ CORS enabled for cross-origin requests
- ✅ Detailed error messages
- ✅ Stream type detection (HLS, MP4, etc.)
- ✅ Automatic HLS playlist verification

---

## 🐛 Troubleshooting

**Error: "Invalid or inaccessible .m3u8 stream"**
- Check if URL is publicly accessible
- Test in VLC: `vlc https://your-stream.m3u8`

**Error: "Module not found"**
- Run: `./install_dependencies.sh`

**Streams not playing in grid**
- Check browser console (F12)
- Ensure streams are HLS (.m3u8)

---

## 📖 Full Documentation

- `CCTV_M3U8_FIX.md` - Complete technical details
- `backend/CCTV/START_HERE.md` - Stream viewer tools
