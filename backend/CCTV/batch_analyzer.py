#!/usr/bin/env python3
"""
Batch CCTV URL Analyzer - Find M3U8 streams from multiple URLs
Processes multiple CCTV webpage URLs and extracts all stream links
"""

import argparse
import sys
import json
from cctv_analyzer import CCTVAnalyzer


class BatchAnalyzer:
    def __init__(self):
        self.results = []
    
    def analyze_urls(self, urls):
        """Analyze multiple URLs and collect stream links"""
        print("\n" + "="*70)
        print("BATCH CCTV ANALYZER - Finding M3U8 Streams")
        print("="*70)
        print(f"\nAnalyzing {len(urls)} URL(s)...\n")
        
        for idx, url in enumerate(urls, 1):
            print(f"\n[{idx}/{len(urls)}] Processing: {url}")
            print("-" * 70)
            
            try:
                analyzer = CCTVAnalyzer(url)
                analyzer.analyze_url()
                
                if analyzer.stream_urls:
                    for stream_url in analyzer.stream_urls:
                        protocol = analyzer.protocol_info.get(stream_url, {}).get('protocol', 'Unknown')
                        
                        result = {
                            'source_url': url,
                            'stream_url': stream_url,
                            'protocol': protocol
                        }
                        self.results.append(result)
                        
                        print(f"  ✓ Found: {stream_url[:80]}...")
                        print(f"    Protocol: {protocol}")
                else:
                    print(f"  ✗ No streams found")
                    
            except Exception as e:
                print(f"  ✗ Error: {e}")
        
        return self.results
    
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
        elif 'youtube.com' in url_lower or 'youtu.be' in url_lower:
            protocol = "YouTube"
            description = "YouTube Live Stream or Video"
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
    
    def display_results(self):
        """Display summary of found streams"""
        print("\n" + "="*70)
        print("RESULTS SUMMARY")
        print("="*70)
        
        if not self.results:
            print("\n✗ No streams found from any URL")
            return
        
        print(f"\n✓ Found {len(self.results)} stream(s) total\n")
        
        for idx, result in enumerate(self.results, 1):
            print(f"{idx}. {result['protocol']} Stream")
            print(f"   Source: {result['source_url']}")
            print(f"   Stream: {result['stream_url']}")
            print()
    
    def export_json(self, filename):
        """Export results to JSON file"""
        data = {
            'total_streams': len(self.results),
            'streams': self.results
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"\n✓ Exported {len(self.results)} stream(s) to {filename}")
    
    def export_html(self, filename):
        """Export results to HTML multi-grid viewer"""
        html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Feed CCTV Viewer - {count} Streams</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #1a1a1a;
            color: white;
            overflow-x: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }}
        
        .header h1 {{
            font-size: 24px;
            margin-bottom: 5px;
        }}
        
        .header p {{
            opacity: 0.9;
            font-size: 14px;
        }}
        
        .grid-container {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 15px;
            padding: 20px;
            max-width: 1920px;
            margin: 0 auto;
        }}
        
        .stream-card {{
            background: #2a2a2a;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0,0,0,0.4);
            transition: transform 0.2s;
        }}
        
        .stream-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.6);
        }}
        
        .stream-header {{
            background: #333;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .stream-title {{
            font-size: 14px;
            font-weight: 600;
            color: #fff;
        }}
        
        .stream-badge {{
            background: #667eea;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }}
        
        .video-container {{
            position: relative;
            background: #000;
            aspect-ratio: 16/9;
        }}
        
        video {{
            width: 100%;
            height: 100%;
            display: block;
        }}
        
        .status-overlay {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.8);
            color: white;
            font-size: 14px;
        }}
        
        .controls {{
            padding: 12px 15px;
            background: #2a2a2a;
            display: flex;
            gap: 10px;
        }}
        
        .btn {{
            flex: 1;
            padding: 8px;
            background: #444;
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        }}
        
        .btn:hover {{
            background: #555;
        }}
        
        .btn.fullscreen {{
            background: #667eea;
        }}
        
        .btn.fullscreen:hover {{
            background: #7689f0;
        }}
        
        @media (max-width: 1400px) {{
            .grid-container {{
                grid-template-columns: repeat(3, 1fr);
            }}
        }}
        
        @media (max-width: 1024px) {{
            .grid-container {{
                grid-template-columns: repeat(2, 1fr);
            }}
        }}
        
        @media (max-width: 768px) {{
            .grid-container {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🎥 Multi-Feed CCTV Viewer</h1>
        <p>{count} Live Stream{plural}</p>
    </div>
    
    <div class="grid-container" id="gridContainer">
        <!-- Streams will be inserted here -->
    </div>

    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script>
        const streams = {streams_json};
        
        function createStreamCard(stream, index) {{
            const card = document.createElement('div');
            card.className = 'stream-card';
            card.id = `stream-${{index}}`;
            
            card.innerHTML = `
                <div class="stream-header">
                    <div class="stream-title">Stream ${{index + 1}}</div>
                    <div class="stream-badge">${{stream.protocol}}</div>
                </div>
                <div class="video-container">
                    <video id="video-${{index}}" controls muted></video>
                    <div class="status-overlay" id="status-${{index}}">Loading...</div>
                </div>
                <div class="controls">
                    <button class="btn" onclick="reloadStream(${{index}})">⟳ Reload</button>
                    <button class="btn fullscreen" onclick="toggleFullscreen(${{index}})">⛶ Fullscreen</button>
                </div>
            `;
            
            return card;
        }}
        
        function loadStream(streamUrl, videoId, statusId, index) {{
            const video = document.getElementById(videoId);
            const status = document.getElementById(statusId);
            
            if (Hls.isSupported()) {{
                const hls = new Hls({{
                    enableWorker: true,
                    lowLatencyMode: false,
                    maxBufferLength: 30,
                    maxMaxBufferLength: 60,
                    backBufferLength: 90
                }});
                
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                
                hls.on(Hls.Events.MANIFEST_PARSED, function() {{
                    status.style.display = 'none';
                    video.play().catch(e => {{
                        status.textContent = 'Click to play';
                        status.style.cursor = 'pointer';
                        status.onclick = () => {{
                            video.play();
                            status.style.display = 'none';
                        }};
                    }});
                }});
                
                hls.on(Hls.Events.ERROR, function(event, data) {{
                    if (data.fatal) {{
                        status.style.display = 'flex';
                        status.textContent = 'Error loading stream';
                        setTimeout(() => {{
                            hls.startLoad();
                        }}, 2000);
                    }}
                }});
                
                window[`hls_${{index}}`] = hls;
                
            }} else if (video.canPlayType('application/vnd.apple.mpegurl')) {{
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', function() {{
                    status.style.display = 'none';
                    video.play();
                }});
            }}
        }}
        
        function reloadStream(index) {{
            const hls = window[`hls_${{index}}`];
            if (hls) {{
                hls.destroy();
            }}
            const video = document.getElementById(`video-${{index}}`);
            const status = document.getElementById(`status-${{index}}`);
            status.style.display = 'flex';
            status.textContent = 'Reloading...';
            setTimeout(() => {{
                loadStream(streams[index].stream_url, `video-${{index}}`, `status-${{index}}`, index);
            }}, 500);
        }}
        
        function toggleFullscreen(index) {{
            const video = document.getElementById(`video-${{index}}`);
            if (video.requestFullscreen) {{
                video.requestFullscreen();
            }} else if (video.webkitRequestFullscreen) {{
                video.webkitRequestFullscreen();
            }}
        }}
        
        // Initialize all streams
        const container = document.getElementById('gridContainer');
        streams.forEach((stream, index) => {{
            const card = createStreamCard(stream, index);
            container.appendChild(card);
            setTimeout(() => {{
                loadStream(stream.stream_url, `video-${{index}}`, `status-${{index}}`, index);
            }}, index * 500); // Stagger loading
        }});
    </script>
</body>
</html>'''
        
        streams_json = json.dumps(self.results)
        html_content = html_template.format(
            count=len(self.results),
            plural='s' if len(self.results) != 1 else '',
            streams_json=streams_json
        )
        
        with open(filename, 'w') as f:
            f.write(html_content)
        
        print(f"✓ Created multi-grid viewer: {filename}")
        print(f"  Open it in your browser to view all {len(self.results)} streams!")


def main():
    parser = argparse.ArgumentParser(
        description='Batch CCTV URL Analyzer - Find M3U8 streams from multiple URLs',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Analyze multiple URLs from command line
  python batch_analyzer.py url1 url2 url3
  
  # Read URLs from file
  python batch_analyzer.py --file urls.txt
  
  # Export results
  python batch_analyzer.py url1 url2 --json streams.json --html viewer.html
  
  # Interactive mode
  python batch_analyzer.py --interactive
        """
    )
    
    parser.add_argument('urls', nargs='*', help='URLs to analyze')
    parser.add_argument('--file', '-f', help='Read URLs from file (one per line)')
    parser.add_argument('--json', '-j', help='Export results to JSON file')
    parser.add_argument('--html', help='Create multi-grid HTML viewer')
    parser.add_argument('--interactive', '-i', action='store_true',
                       help='Interactive mode - paste URLs one by one')
    
    args = parser.parse_args()
    
    urls = []
    
    # Interactive mode
    if args.interactive:
        print("\n" + "="*70)
        print("INTERACTIVE MODE")
        print("="*70)
        print("\nPaste CCTV webpage URLs (one per line)")
        print("Press Enter twice when done, or Ctrl+C to finish\n")
        
        while True:
            try:
                url = input("URL: ").strip()
                if not url:
                    if urls:
                        break
                    else:
                        continue
                urls.append(url)
                print(f"  ✓ Added ({len(urls)} total)")
            except (KeyboardInterrupt, EOFError):
                print()
                break
    
    # Read from file
    elif args.file:
        try:
            with open(args.file, 'r') as f:
                urls = [line.strip() for line in f if line.strip()]
        except Exception as e:
            print(f"Error reading file: {e}")
            sys.exit(1)
    
    # Command line URLs
    else:
        urls = args.urls
    
    if not urls:
        parser.print_help()
        print("\n✗ No URLs provided")
        sys.exit(1)
    
    # Analyze URLs
    analyzer = BatchAnalyzer()
    analyzer.analyze_urls(urls)
    analyzer.display_results()
    
    # Export results
    if args.json:
        analyzer.export_json(args.json)
    
    if args.html:
        analyzer.export_html(args.html)
    elif analyzer.results:
        # Auto-create HTML viewer
        default_html = 'multi_feed_viewer.html'
        analyzer.export_html(default_html)


if __name__ == "__main__":
    main()
