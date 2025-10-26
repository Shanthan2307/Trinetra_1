#!/bin/bash

echo "======================================"
echo "  Trinetra CCTV - Dependency Installer"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"
echo ""

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

echo "✓ pip3 found"
echo ""

# Install requirements
echo "📦 Installing Python dependencies..."
echo ""

pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All dependencies installed successfully!"
    echo ""
    echo "======================================"
    echo "  Installation Complete!"
    echo "======================================"
    echo ""
    echo "Next steps:"
    echo "1. Run: python3 main.py"
    echo "2. Open the frontend in your browser"
    echo "3. Add .m3u8 camera streams!"
    echo ""
    echo "Key features enabled:"
    echo "  ✓ HLS stream validation"
    echo "  ✓ CORS support"
    echo "  ✓ Enhanced error handling"
    echo ""
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above."
    exit 1
fi
