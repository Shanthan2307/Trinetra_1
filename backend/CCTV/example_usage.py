#!/usr/bin/env python3
"""
Example usage of the CCTV Analyzer
This demonstrates how to use the CCTVAnalyzer class programmatically
"""

from cctv_analyzer import CCTVAnalyzer


def example_1_analyze_url():
    """Example 1: Basic URL analysis"""
    print("=" * 70)
    print("EXAMPLE 1: Analyze a CCTV webpage")
    print("=" * 70)
    
    # Replace this with your actual CCTV feed URL
    url = "https://example.com/camera"
    
    analyzer = CCTVAnalyzer(url)
    analyzer.analyze_url()
    analyzer.display_analysis()
    
    print("\nStreams found:", len(analyzer.stream_urls))
    for i, stream_url in enumerate(analyzer.stream_urls):
        print(f"  [{i}] {stream_url}")


def example_2_direct_stream():
    """Example 2: Direct stream URL"""
    print("\n" + "=" * 70)
    print("EXAMPLE 2: Direct RTSP stream")
    print("=" * 70)
    
    # Example RTSP URL format (replace with your camera's URL)
    # Common formats:
    # - rtsp://username:password@ip:port/stream
    # - rtsp://192.168.1.100:554/cam/realmonitor?channel=1&subtype=0
    
    url = "rtsp://admin:password@192.168.1.100:554/stream"
    
    analyzer = CCTVAnalyzer(url)
    analyzer.analyze_url()
    analyzer.display_analysis()


def example_3_test_stream():
    """Example 3: Test and display a stream"""
    print("\n" + "=" * 70)
    print("EXAMPLE 3: Test and display stream")
    print("=" * 70)
    
    # Replace with a working stream URL
    url = "rtsp://admin:password@192.168.1.100:554/stream"
    
    analyzer = CCTVAnalyzer(url)
    analyzer.analyze_url()
    
    if analyzer.stream_urls:
        # Test the first stream found
        analyzer.test_stream(analyzer.stream_urls[0])
    else:
        print("No streams found to test")


def example_4_public_streams():
    """Example 4: Some public stream examples"""
    print("\n" + "=" * 70)
    print("EXAMPLE 4: Public stream examples")
    print("=" * 70)
    
    # These are examples of common public stream URLs
    # Note: Replace these with actual working URLs
    
    examples = [
        "https://example.com/stream.m3u8",  # HLS stream
        "rtsp://example.com:554/stream",     # RTSP stream
        "https://example.com/camera/feed",   # Webpage with embedded stream
    ]
    
    print("\nCommon stream URL formats:")
    for i, url in enumerate(examples, 1):
        print(f"  {i}. {url}")
    
    print("\nTo test any of these, replace with a real URL and run:")
    print("  analyzer = CCTVAnalyzer(url)")
    print("  analyzer.analyze_url()")
    print("  analyzer.test_stream(analyzer.stream_urls[0])")


def main():
    """Main function to run examples"""
    print("\n" + "=" * 70)
    print("CCTV ANALYZER - USAGE EXAMPLES")
    print("=" * 70)
    
    print("\nThese examples demonstrate how to use the CCTVAnalyzer class.")
    print("Replace the example URLs with your actual CCTV feed URLs.\n")
    
    # Run examples
    example_1_analyze_url()
    example_2_direct_stream()
    # example_3_test_stream()  # Uncomment to test stream display
    example_4_public_streams()
    
    print("\n" + "=" * 70)
    print("HOW TO USE WITH YOUR OWN URL")
    print("=" * 70)
    print("""
1. Paste your CCTV feed URL into the script:
   
   url = "YOUR_URL_HERE"  # Replace this
   
2. Run the analyzer:
   
   python cctv_analyzer.py "YOUR_URL_HERE"
   
3. To view the stream:
   
   python cctv_analyzer.py "YOUR_URL_HERE" --test

4. Common URL formats:
   - Webpage: https://example.com/camera
   - RTSP: rtsp://username:password@ip:port/stream
   - HLS: https://example.com/stream.m3u8
   - MJPEG: http://ip:port/video.mjpeg
    """)


if __name__ == "__main__":
    main()
