#!/usr/bin/env python3
"""
CCTV Feed Analyzer and Viewer
This script analyzes CCTV feed URLs to understand streaming protocols and display video feeds.
"""

import re
import sys
import requests
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import cv2
import argparse
import time


class CCTVAnalyzer:
    def __init__(self, url):
        self.url = url
        self.stream_urls = []
        self.protocol_info = {}
        
    def analyze_url(self):
        """Analyze the provided URL to identify CCTV feed sources"""
        print(f"\n{'='*60}")
        print(f"Analyzing URL: {self.url}")
        print(f"{'='*60}\n")
        
        # Check if it's a direct stream URL
        if self.is_direct_stream(self.url):
            print("✓ Direct stream URL detected!")
            self.stream_urls.append(self.url)
            self.identify_protocol(self.url)
        else:
            # Try to fetch and parse the webpage
            print("Fetching webpage content...")
            self.parse_webpage()
    
    def is_direct_stream(self, url):
        """Check if URL is a direct video stream"""
        stream_extensions = ['.m3u8', '.mpd', '.ts', '.mp4', '.flv', '.mjpeg', '.mjpg']
        stream_protocols = ['rtsp://', 'rtmp://', 'mms://', 'mmsh://']
        
        url_lower = url.lower()
        
        # Check for stream protocols
        for protocol in stream_protocols:
            if url_lower.startswith(protocol):
                return True
        
        # Check for stream extensions
        for ext in stream_extensions:
            if ext in url_lower:
                return True
        
        return False
    
    def parse_webpage(self):
        """Parse webpage to find video/stream URLs"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(self.url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            print("✓ Webpage fetched successfully!\n")
            print("Searching for video sources...\n")
            
            # Find video tags
            videos = soup.find_all('video')
            if videos:
                print(f"Found {len(videos)} <video> tag(s):")
                for i, video in enumerate(videos, 1):
                    src = video.get('src')
                    if src:
                        full_url = urljoin(self.url, src)
                        self.stream_urls.append(full_url)
                        print(f"  [{i}] {full_url}")
                    
                    # Check for source tags within video
                    sources = video.find_all('source')
                    for source in sources:
                        src = source.get('src')
                        if src:
                            full_url = urljoin(self.url, src)
                            self.stream_urls.append(full_url)
                            print(f"  [{i}] {full_url}")
            
            # Find iframe tags (often used for embedded streams)
            iframes = soup.find_all('iframe')
            if iframes:
                print(f"\nFound {len(iframes)} <iframe> tag(s):")
                for i, iframe in enumerate(iframes, 1):
                    src = iframe.get('src')
                    if src:
                        full_url = urljoin(self.url, src)
                        print(f"  [{i}] {full_url}")
                        print(f"      (You may need to analyze this URL separately)")
            
            # Search for common streaming URLs in page source
            self.find_stream_urls_in_source(response.text)
            
            # Identify protocols for found URLs
            for url in self.stream_urls:
                self.identify_protocol(url)
                
        except requests.RequestException as e:
            print(f"✗ Error fetching webpage: {e}")
            sys.exit(1)
    
    def find_stream_urls_in_source(self, html_content):
        """Search for streaming URLs in the page source using regex"""
        patterns = [
            r'https?://[^\s"\'<>]+\.m3u8[^\s"\'<>]*',
            r'rtsp://[^\s"\'<>]+',
            r'rtmp://[^\s"\'<>]+',
            r'https?://[^\s"\'<>]+\.mpd[^\s"\'<>]*',
            r'https?://[^\s"\'<>]+\.flv[^\s"\'<>]*',
        ]
        
        found_urls = set()
        for pattern in patterns:
            matches = re.findall(pattern, html_content)
            found_urls.update(matches)
        
        if found_urls:
            print(f"\nFound {len(found_urls)} potential stream URL(s) in source:")
            for i, url in enumerate(found_urls, 1):
                if url not in self.stream_urls:
                    self.stream_urls.append(url)
                print(f"  [{i}] {url}")
    
    def identify_protocol(self, url):
        """Identify the streaming protocol"""
        url_lower = url.lower()
        
        protocol = "Unknown"
        description = ""
        
        if url_lower.startswith('rtsp://'):
            protocol = "RTSP"
            description = "Real-Time Streaming Protocol - Common for IP cameras"
        elif url_lower.startswith('rtmp://'):
            protocol = "RTMP"
            description = "Real-Time Messaging Protocol - Adobe Flash streaming"
        elif '.m3u8' in url_lower:
            protocol = "HLS"
            description = "HTTP Live Streaming - Apple's streaming protocol"
        elif '.mpd' in url_lower:
            protocol = "DASH"
            description = "Dynamic Adaptive Streaming over HTTP"
        elif url_lower.startswith('http://') or url_lower.startswith('https://'):
            if '.mjpeg' in url_lower or '.mjpg' in url_lower:
                protocol = "MJPEG"
                description = "Motion JPEG - Stream of JPEG images"
            elif '.mp4' in url_lower:
                protocol = "HTTP/MP4"
                description = "Progressive download or streaming MP4"
            else:
                protocol = "HTTP"
                description = "HTTP-based stream"
        
        self.protocol_info[url] = {
            'protocol': protocol,
            'description': description
        }
    
    def display_analysis(self):
        """Display detailed analysis of found streams"""
        print(f"\n{'='*60}")
        print("ANALYSIS RESULTS")
        print(f"{'='*60}\n")
        
        if not self.stream_urls:
            print("✗ No stream URLs found.")
            print("\nTroubleshooting tips:")
            print("  • The stream might be loaded dynamically via JavaScript")
            print("  • Check browser DevTools Network tab for .m3u8 or video URLs")
            print("  • The stream might require authentication")
            print("  • Try inspecting the page source manually")
            return
        
        for i, url in enumerate(self.stream_urls, 1):
            info = self.protocol_info.get(url, {})
            protocol = info.get('protocol', 'Unknown')
            description = info.get('description', '')
            
            print(f"Stream #{i}:")
            print(f"  URL: {url}")
            print(f"  Protocol: {protocol}")
            print(f"  Description: {description}")
            print()
    
    def test_stream(self, stream_url):
        """Attempt to open and display the stream"""
        print(f"\n{'='*60}")
        print(f"Testing Stream: {stream_url}")
        print(f"{'='*60}\n")
        
        protocol = self.protocol_info.get(stream_url, {}).get('protocol', 'Unknown')
        
        print(f"Opening stream with OpenCV...")
        print(f"Protocol detected: {protocol}")
        print(f"\nPress 'q' to quit the video feed.\n")
        
        # Try to open the stream
        cap = cv2.VideoCapture(stream_url)
        
        if not cap.isOpened():
            print(f"✗ Failed to open stream: {stream_url}")
            print("\nPossible reasons:")
            print("  • Invalid stream URL")
            print("  • Stream requires authentication")
            print("  • Network connectivity issues")
            print("  • Unsupported protocol/codec")
            print(f"  • For RTSP streams, ensure port 554 is accessible")
            return False
        
        print("✓ Stream opened successfully!")
        print("Displaying video feed...\n")
        
        frame_count = 0
        start_time = time.time()
        
        success = False
        try:
            while True:
                ret, frame = cap.read()
                
                if not ret:
                    print("\n✗ Failed to read frame from stream")
                    break
                
                frame_count += 1
                
                # Calculate FPS
                elapsed = time.time() - start_time
                fps = frame_count / elapsed if elapsed > 0 else 0
                
                # Display info on frame
                cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(frame, f"Frame: {frame_count}", (10, 70), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(frame, "Press 'q' to quit", (10, 110), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
                cv2.imshow('CCTV Feed', frame)
                
                # Press 'q' to exit
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("\nUser requested exit.")
                    success = True
                    break
                    
        except KeyboardInterrupt:
            print("\nStream interrupted by user.")
            success = True
        finally:
            cap.release()
            cv2.destroyAllWindows()
            print(f"\n✓ Stream closed. Total frames: {frame_count}")
        
        return success


def main():
    parser = argparse.ArgumentParser(
        description='CCTV Feed Analyzer - Analyze and view CCTV streams',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python cctv_analyzer.py https://example.com/camera
  python cctv_analyzer.py rtsp://192.168.1.100:554/stream
  python cctv_analyzer.py --test https://example.com/stream.m3u8
        """
    )
    
    parser.add_argument('url', help='URL of the CCTV feed or webpage')
    parser.add_argument('--test', action='store_true', 
                       help='Attempt to display the video feed')
    parser.add_argument('--stream-index', type=int, default=0,
                       help='Index of stream to test (default: 0)')
    
    args = parser.parse_args()
    
    # Create analyzer
    analyzer = CCTVAnalyzer(args.url)
    
    # Analyze the URL
    analyzer.analyze_url()
    
    # Display analysis
    analyzer.display_analysis()
    
    # Test stream if requested
    if args.test and analyzer.stream_urls:
        if args.stream_index < len(analyzer.stream_urls):
            stream_to_test = analyzer.stream_urls[args.stream_index]
        else:
            print(f"\n✗ Invalid stream index. Using first stream.")
            stream_to_test = analyzer.stream_urls[0]
        
        analyzer.test_stream(stream_to_test)
    elif args.test:
        print("\n✗ No streams found to test.")
    else:
        print("\nTip: Use --test flag to attempt viewing the stream")
        print(f"Example: python cctv_analyzer.py \"{args.url}\" --test")


if __name__ == "__main__":
    main()
