# Trinetra CCTV Integration Guide

## Overview
The CCTV folder logic has been successfully integrated with the Initialize Camera Protocol button. The system now analyzes webpage URLs to automatically extract CCTV stream URLs and display them in a dynamic grid.

## What Was Implemented

### Backend (main.py)
1. **New API Endpoint: `/api/analyze_cctv_url`**
   - Analyzes any webpage URL to extract CCTV stream URLs
   - Supports multiple stream formats: `.m3u8`, `.mpd`, `.ts`, `.mp4`, `.flv`, `.mjpeg`, etc.
   - Supports protocols: `rtsp://`, `rtmp://`, `mms://`, `mmsh://`
   - Parses HTML to find:
     - Direct stream URLs
     - `<video>` tags with `src` attributes
     - `<source>` tags within videos
     - `<iframe>` tags with stream URLs
     - Stream URLs in JavaScript code

2. **New API Endpoint: `/api/get_cctv_streams`**
   - Retrieves all stored CCTV camera streams from the database
   - Returns camera UID, stream URL, description, and location

### Frontend (App.js)
1. **Updated Initialize Camera Protocol Workflow**
   - **Step 1:** Enter webpage URL (e.g., https://camguide.net/usa/california/san-francisco/tennis/)
   - **Step 2:** Click [ANALYZE URL] to extract stream URLs
   - **Step 3:** Select from found streams (radio buttons)
   - **Step 4:** Enter camera coordinates and description
   - **Step 5:** Click [COMMIT] to save

2. **New State Variables**
   - `webpageUrl` - Input URL to analyze
   - `extractedStreams` - Array of found stream URLs
   - `selectedStreamUrl` - User-selected stream
   - `isAnalyzing` - Loading state during analysis

3. **New Function: `analyzeCCTVUrl()`**
   - Calls backend `/api/analyze_cctv_url` endpoint
   - Shows toast notifications for success/failure
   - Automatically selects first found stream

4. **Updated Function: `addNewCamera()`**
   - Now uses `selectedStreamUrl` instead of manual input
   - Refreshes camera list after adding
   - Resets form state

### Frontend (CCTVGrid.js)
1. **Dynamic Camera Loading**
   - Fetches actual camera streams from `/api/get_cctv_streams`
   - Shows loading state while fetching
   - Falls back to demo camera if no streams configured
   - Each grid cell displays a different camera stream

2. **Features**
   - 3×3 grid layout (expandable)
   - Live HLS video streaming with hls.js
   - Automatic error recovery
   - Camera labels (CAM-01, CAM-02, etc.)
   - Live indicators
   - Smooth scrolling for additional cameras

## How to Use

### Adding a New CCTV Camera

1. **Start the Backend**
   ```bash
   cd /Users/joker2307/Desktop/unagi/backend
   source venv/bin/activate
   python3 main.py
   ```

2. **Start the Frontend**
   ```bash
   cd /Users/joker2307/Desktop/unagi/frontend
   npm start
   ```

3. **Login with Sui Wallet**
   - Click the Sui wallet button
   - Authenticate

4. **Open Initialize Camera Protocol**
   - Click `[INIT-CAMERA-PROTOCOL]` button
   - The popup shows a 3-step workflow

5. **Extract Stream URL**
   - Paste a webpage URL containing a CCTV feed
   - Examples:
     - `https://camguide.net/usa/california/san-francisco/tennis/`
     - Any webpage with embedded video streams
   - Click `[ANALYZE URL]`
   - Wait for analysis to complete

6. **Select Stream**
   - Choose from the list of extracted stream URLs
   - The system may find multiple streams on the same page

7. **Enter Camera Details**
   - **Coordinates**: `37.7749,-122.4194` (San Francisco format)
   - **Description**: "Golden Gate Park Tennis Courts"

8. **Commit**
   - Click `[COMMIT]` to save the camera
   - You'll see a success toast notification

9. **View in CCTV Grid**
   - Click `[OPEN-CCTV]` button
   - Your camera stream will appear in the grid
   - Each camera has its own live feed

## Supported Stream Formats

### Direct Stream URLs
- HLS (`.m3u8`) - Most common for web CCTV
- DASH (`.mpd`)
- MPEG-TS (`.ts`)
- MP4 (`.mp4`)
- FLV (`.flv`)
- MJPEG (`.mjpeg`, `.mjpg`)

### Streaming Protocols
- RTSP (`rtsp://`)
- RTMP (`rtmp://`)
- MMS (`mms://`)
- MMSH (`mmsh://`)

### Webpage Extraction
- Embedded `<video>` tags
- `<source>` elements
- `<iframe>` embeds
- JavaScript-loaded streams

## Example URLs to Test

1. **Tennis Courts (San Francisco)**
   ```
   https://camguide.net/usa/california/san-francisco/tennis/
   ```

2. **Direct HLS Stream**
   ```
   https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af
   ```

## Technical Architecture

```
User Input (Webpage URL)
         ↓
Frontend: analyzeCCTVUrl()
         ↓
Backend: /api/analyze_cctv_url
         ↓
BeautifulSoup + Regex Parsing
         ↓
Extract Stream URLs
         ↓
Return to Frontend
         ↓
User Selects Stream
         ↓
addNewCamera() → /api/add_camera
         ↓
Store in ChromaDB
         ↓
CCTVGrid fetches → /api/get_cctv_streams
         ↓
Display in Grid with hls.js
```

## Dependencies Installed

### Backend
- `beautifulsoup4` - HTML parsing
- `lxml` - Fast XML/HTML parser

### Frontend
- `hls.js` - HLS video streaming library

## Database Schema

Each camera is stored with:
- `uid` - Unique identifier
- `location` - GPS coordinates
- `image_url` - **Stream URL** (repurposed field)
- `description` - Camera description
- `txHash`, `ipId`, `tokenId`, `CID` - Blockchain placeholders

## Troubleshooting

### No Streams Found
- Check if the webpage actually contains video streams
- Try inspecting the webpage source for video tags
- Some websites use anti-scraping measures

### Stream Won't Play
- Verify the stream URL is publicly accessible
- Check browser console for CORS errors
- HLS streams require compatible codecs
- Some streams need authentication

### Backend Errors
- Ensure BeautifulSoup4 is installed: `pip install beautifulsoup4 lxml`
- Check Flask is running on port 5000
- Verify ChromaDB is initialized

### Frontend Errors
- Ensure hls.js is installed: `npm install hls.js --legacy-peer-deps`
- Clear browser cache if videos don't load
- Check React dev tools for state issues

## Future Enhancements

1. **Batch Import**
   - Upload a list of URLs
   - Analyze and import multiple cameras at once

2. **Stream Health Monitoring**
   - Check if streams are online
   - Auto-reconnect failed streams
   - Show connection status

3. **Advanced Filtering**
   - Filter by location
   - Search by description
   - Sort by quality/FPS

4. **Recording**
   - Record and save footage
   - Cloud storage integration
   - Playback controls

5. **AI Analysis**
   - Real-time object detection
   - Person recognition
   - Anomaly detection

## Credits

Built with:
- React + Tailwind CSS
- Flask + ChromaDB
- HLS.js for video streaming
- BeautifulSoup4 for web scraping
- Sui blockchain integration
