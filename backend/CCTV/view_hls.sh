#!/bin/bash
# Quick HLS Stream Viewer

STREAM_URL="$1"

if [ -z "$STREAM_URL" ]; then
    echo "Usage: ./view_hls.sh <stream-url>"
    exit 1
fi

echo "=========================================="
echo "HLS Stream Viewer"
echo "=========================================="
echo "Stream: $STREAM_URL"
echo ""

# Try ffplay first (best for HLS)
if command -v ffplay &> /dev/null; then
    echo "Opening with ffplay..."
    echo "Press 'q' to quit"
    ffplay -fflags nobuffer -flags low_delay -probesize 32 -analyzeduration 0 "$STREAM_URL"
elif command -v vlc &> /dev/null; then
    echo "Opening with VLC..."
    vlc "$STREAM_URL"
elif [ -f "/Applications/VLC.app/Contents/MacOS/VLC" ]; then
    echo "Opening with VLC (macOS)..."
    /Applications/VLC.app/Contents/MacOS/VLC "$STREAM_URL"
else
    echo "✗ No video player found!"
    echo ""
    echo "Install a player:"
    echo "  brew install ffmpeg  # Includes ffplay"
    echo "  brew install vlc"
    exit 1
fi
