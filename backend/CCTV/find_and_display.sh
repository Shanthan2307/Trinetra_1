#!/bin/bash
# Quick script to find M3U8 streams and display them in a grid

echo "======================================"
echo "Multi-Feed CCTV Stream Finder"
echo "======================================"
echo ""
echo "This will help you find M3U8 streams from multiple URLs"
echo "and display them all in a grid viewer!"
echo ""
echo "Options:"
echo "  1. Interactive mode (paste URLs one by one)"
echo "  2. Use URLs from file (urls.txt)"
echo "  3. Open grid viewer directly (add streams manually)"
echo ""
read -p "Choose option (1-3): " choice

cd "$(dirname "$0")"

case $choice in
    1)
        echo ""
        echo "Starting interactive mode..."
        echo "Paste your CCTV webpage URLs and press Enter after each"
        echo ""
        source venv/bin/activate
        python batch_analyzer.py --interactive
        
        if [ -f "multi_feed_viewer.html" ]; then
            echo ""
            echo "Opening viewer with all your streams..."
            open multi_feed_viewer.html
        fi
        ;;
    2)
        echo ""
        echo "Reading URLs from urls.txt..."
        
        if [ ! -f "urls.txt" ]; then
            echo "Creating urls.txt template..."
            cat > urls.txt << 'EOF'
# Paste your CCTV webpage URLs here (one per line)
# Lines starting with # are ignored

# Example:
https://camguide.net/usa/california/san-francisco/tennis/

# Add more URLs below:

EOF
            echo "✓ Created urls.txt"
            echo ""
            echo "Please edit urls.txt and add your URLs, then run this script again"
            exit 0
        fi
        
        source venv/bin/activate
        python batch_analyzer.py --file urls.txt
        
        if [ -f "multi_feed_viewer.html" ]; then
            echo ""
            echo "Opening viewer with all your streams..."
            open multi_feed_viewer.html
        fi
        ;;
    3)
        echo ""
        echo "Opening grid viewer..."
        echo "Click '+ Add Stream' to manually add M3U8 URLs"
        open multi_grid_viewer.html
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
