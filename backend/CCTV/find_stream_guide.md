# How to Find the Stream URL from a Webpage

## For: https://camguide.net/usa/california/san-francisco/tennis/

The script couldn't find the stream URL automatically because the page loads it via JavaScript. Here's how to find it manually:

## Method 1: Browser DevTools (Recommended)

### Step-by-Step:

1. **Open the page in Chrome or Firefox:**
   ```
   https://camguide.net/usa/california/san-francisco/tennis/
   ```

2. **Open Developer Tools:**
   - Press **F12** (Windows/Linux)
   - Or press **Cmd+Option+I** (macOS)
   - Or right-click → "Inspect"

3. **Go to the Network Tab:**
   - Click on the "Network" tab at the top of DevTools

4. **Filter for media:**
   - In the filter box, type: `m3u8` OR `mpd` OR `mp4` OR `rtsp`
   - Or click the "Media" filter button

5. **Reload the page:**
   - Press **Cmd+R** (macOS) or **Ctrl+R** (Windows/Linux)
   - Or click the reload button

6. **Look for stream URLs:**
   - You should see requests like:
     - `*.m3u8` (HLS streams)
     - `*.mpd` (DASH streams)
     - `*.mp4` (MP4 videos)
     - Video player requests

7. **Copy the URL:**
   - Click on the request
   - Right-click → Copy → Copy URL
   - Or look in the "Headers" tab for the full URL

8. **Test with the script:**
   ```bash
   source venv/bin/activate
   python cctv_analyzer.py "PASTE_URL_HERE" --test
   ```

## Method 2: View Page Source

1. **Right-click on the video player** → "Inspect Element"

2. **Look for:**
   - `<video>` tags with `src` attribute
   - `<iframe>` tags with `src` attribute
   - JavaScript variables like `videoUrl`, `streamUrl`, `source`

3. **Search the page source:**
   - Press **Cmd+F** (macOS) or **Ctrl+F** (Windows/Linux)
   - Search for: `.m3u8`, `.mpd`, `rtsp://`, `stream`, `video`

## Method 3: Console Inspection

1. **Open DevTools Console tab**

2. **Try these commands:**
   ```javascript
   // Find all video elements
   document.querySelectorAll('video')
   
   // Find all iframes
   document.querySelectorAll('iframe')
   
   // Check for common video player libraries
   jwplayer
   videojs
   player
   ```

3. **Look for source URLs in the output**

## What to Look For

Common patterns on webcam sites:

### HLS Streams (.m3u8)
```
https://example.com/live/stream.m3u8
https://cdn.example.com/hls/camera1/playlist.m3u8
```

### Embedded Players
```html
<iframe src="https://player.example.com/embed/camera123"></iframe>
```

### YouTube Live Embeds
```html
<iframe src="https://www.youtube.com/embed/XXXXX"></iframe>
```

## Example: What You Might Find

After following the steps above, you might find something like:

```
https://streaming.camguide.net/hls/tennis/playlist.m3u8
```

Then test it:
```bash
source venv/bin/activate
python cctv_analyzer.py "https://streaming.camguide.net/hls/tennis/playlist.m3u8" --test
```

## Common Issues on camguide.net

Sites like camguide.net often:
1. **Embed from third parties** (YouTube, Vimeo, etc.)
2. **Use CDN networks** for streaming
3. **Lazy-load videos** (only when you scroll to them)
4. **Require clicking play** before loading the stream

### Tips:
- Click the play button on the video first
- Wait for the video to start playing
- Then check Network tab for stream requests

## Alternative: Check if it's a YouTube Embed

Many webcam sites embed YouTube live streams. Check if:

1. Right-click on video → "Copy video URL"
2. If it's YouTube, you'll get a YouTube link
3. Use that YouTube link directly:
   ```bash
   # For YouTube, you'll need youtube-dl or yt-dlp
   pip install yt-dlp
   yt-dlp "YOUTUBE_URL"
   ```

## Still Can't Find It?

Try these alternative approaches:

### 1. Network Tab - All Requests
- Clear filters in Network tab
- Sort by Size (largest first)
- Look for video-sized files

### 2. Check for CDN Patterns
Common CDN domains:
- `cdn.*.com`
- `stream.*.com`
- `*.cloudfront.net`
- `*.akamaihd.net`

### 3. Look at XHR/Fetch Requests
- Filter Network tab by "XHR" or "Fetch"
- Look for API calls that return video URLs

## Once You Find the Stream URL

```bash
# Activate virtual environment
source venv/bin/activate

# Test the stream
python cctv_analyzer.py "YOUR_STREAM_URL" --test

# If it works, you'll see the live feed!
```

## Example Session

```bash
# 1. Found this URL in DevTools:
#    https://example.com/live/tennis.m3u8

# 2. Test it:
source venv/bin/activate
python cctv_analyzer.py "https://example.com/live/tennis.m3u8" --test

# 3. If successful, a window opens showing the live tennis courts!
```

## Need Help?

If you're stuck:
1. Take a screenshot of the Network tab
2. Share what requests you see
3. Try the URL in VLC Media Player first: `File → Open Network Stream`
