#!/bin/bash
# Quick setup and run script for CCTV Stream Viewer

echo "======================================"
echo "CCTV Stream Viewer - Setup & Run"
echo "======================================"
echo ""

# Tennis courts stream URL
STREAM_URL="https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af"

# Check if FFmpeg is installed
if command -v ffplay &> /dev/null; then
    echo "✓ FFmpeg is installed"
    echo ""
    echo "Opening stream with FFmpeg (most stable option)..."
    echo "Press Q to quit"
    echo ""
    
    ffplay \
        -fflags +genpts+igndts \
        -flags low_delay \
        -probesize 5000000 \
        -analyzeduration 5000000 \
        -max_delay 5000000 \
        -sync audio \
        -framedrop \
        -window_title "Tennis Courts CCTV - Press Q to quit" \
        -vcodec h264 \
        -acodec aac \
        -threads 4 \
        -autoexit \
        -stats \
        -loglevel warning \
        "$STREAM_URL"
else
    echo "✗ FFmpeg not found"
    echo ""
    echo "Would you like to:"
    echo "  1. Install FFmpeg (recommended for best quality)"
    echo "  2. Open web viewer (works now, no installation needed)"
    echo ""
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" = "1" ]; then
        echo ""
        echo "Installing FFmpeg..."
        brew install ffmpeg
        echo ""
        echo "✓ FFmpeg installed!"
        echo "Run this script again to view the stream"
    elif [ "$choice" = "2" ]; then
        echo ""
        echo "Opening web viewer..."
        open hls_web_viewer.html
    else
        echo "Invalid choice"
        exit 1
    fi
fi
