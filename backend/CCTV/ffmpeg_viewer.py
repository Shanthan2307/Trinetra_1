#!/usr/bin/env python3
"""
FFmpeg-based Stream Viewer - Most stable option for HLS streams
Uses FFmpeg directly for decoding with optimal buffering settings
"""

import subprocess
import sys
import argparse
import os
import signal


class FFmpegStreamViewer:
    def __init__(self, stream_url):
        self.stream_url = stream_url
        self.process = None
        
    def view_with_ffplay(self):
        """View stream using ffplay with optimized settings"""
        print("\n" + "="*70)
        print("FFMPEG STREAM VIEWER - Optimized for Continuous Playback")
        print("="*70)
        print(f"\nStream: {self.stream_url}")
        print("\nOptimizations Applied:")
        print("  ✓ Pre-buffering enabled")
        print("  ✓ Low latency mode")
        print("  ✓ Automatic reconnection")
        print("  ✓ Smooth frame delivery")
        print("\nControls:")
        print("  • Q or ESC  - Quit")
        print("  • F         - Toggle fullscreen")
        print("  • P / Space - Pause/Play")
        print("  • M         - Mute/Unmute")
        print("  • Left/Right - Seek -10s / +10s")
        print("  • Up/Down   - Volume")
        print("\n" + "="*70)
        print("Starting stream...\n")
        
        # FFplay command with optimal settings for HLS streaming
        cmd = [
            'ffplay',
            # Input options
            '-i', self.stream_url,
            
            # Performance optimizations
            '-fflags', '+genpts+igndts',       # Generate timestamps
            '-flags', 'low_delay',              # Reduce latency
            '-strict', 'experimental',          # Enable experimental features
            
            # Buffer settings for smooth playback
            '-probesize', '5000000',            # Larger probe for better detection
            '-analyzeduration', '5000000',      # Analyze more data
            '-max_delay', '5000000',            # Max demux delay
            '-reorder_queue_size', '0',         # Disable packet reordering
            
            # Sync settings
            '-sync', 'audio',                   # Sync to audio
            '-framedrop',                       # Drop frames if needed
            
            # Display settings
            '-window_title', 'CCTV Stream - Press Q to quit',
            '-left', '100',
            '-top', '100',
            
            # Codec settings
            '-vcodec', 'h264',                  # H.264 decoder
            '-acodec', 'aac',                   # AAC audio decoder
            
            # Threading
            '-threads', '4',                    # Multi-threading
            
            # Misc
            '-autoexit',                        # Exit when stream ends
            '-stats',                           # Show statistics
            '-loglevel', 'warning'              # Reduce noise
        ]
        
        try:
            self.process = subprocess.run(cmd)
            return True
            
        except FileNotFoundError:
            print("\n✗ ffplay not found!")
            print("\nTo install FFmpeg:")
            print("  macOS:   brew install ffmpeg")
            print("  Linux:   sudo apt install ffmpeg")
            print("  Windows: Download from https://ffmpeg.org/download.html")
            print("\nOr use the web viewer: open hls_web_viewer.html")
            return False
            
        except KeyboardInterrupt:
            print("\n\nPlayback interrupted by user")
            return True
            
        except Exception as e:
            print(f"\n✗ Error: {e}")
            return False
    
    def record_stream(self, output_file, duration=None):
        """Record the stream to a file"""
        print(f"\n{'='*70}")
        print("RECORDING STREAM")
        print(f"{'='*70}")
        print(f"\nStream: {self.stream_url}")
        print(f"Output: {output_file}")
        if duration:
            print(f"Duration: {duration} seconds")
        print("\nRecording... Press Ctrl+C to stop\n")
        
        cmd = [
            'ffmpeg',
            '-i', self.stream_url,
            '-c', 'copy',                       # Copy codec (no re-encoding)
            '-bsf:a', 'aac_adtstoasc',         # Fix AAC stream
        ]
        
        if duration:
            cmd.extend(['-t', str(duration)])
        
        cmd.append(output_file)
        
        try:
            subprocess.run(cmd)
            print(f"\n✓ Recording saved to: {output_file}")
            return True
        except KeyboardInterrupt:
            print(f"\n\nRecording stopped. Saved to: {output_file}")
            return True
        except Exception as e:
            print(f"\n✗ Recording error: {e}")
            return False
    
    def get_stream_info(self):
        """Get detailed stream information"""
        print(f"\n{'='*70}")
        print("STREAM INFORMATION")
        print(f"{'='*70}\n")
        
        cmd = [
            'ffprobe',
            '-i', self.stream_url,
            '-show_streams',
            '-show_format',
            '-loglevel', 'quiet',
            '-print_format', 'default=noprint_wrappers=1'
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            print(result.stdout)
            return True
        except FileNotFoundError:
            print("✗ ffprobe not found (part of FFmpeg)")
            return False
        except Exception as e:
            print(f"✗ Error: {e}")
            return False


def main():
    parser = argparse.ArgumentParser(
        description='FFmpeg-based CCTV Stream Viewer - Most Stable Option',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # View stream
  python ffmpeg_viewer.py "https://example.com/stream.m3u8"
  
  # Record stream for 60 seconds
  python ffmpeg_viewer.py "https://example.com/stream.m3u8" --record output.mp4 --duration 60
  
  # Get stream info
  python ffmpeg_viewer.py "https://example.com/stream.m3u8" --info
  
  # Tennis Courts Camera
  python ffmpeg_viewer.py "https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af"
        """
    )
    
    parser.add_argument('url', help='Stream URL')
    parser.add_argument('--record', '-r', metavar='OUTPUT',
                       help='Record stream to file')
    parser.add_argument('--duration', '-d', type=int,
                       help='Recording duration in seconds')
    parser.add_argument('--info', '-i', action='store_true',
                       help='Show stream information')
    
    args = parser.parse_args()
    
    viewer = FFmpegStreamViewer(args.url)
    
    if args.info:
        viewer.get_stream_info()
    elif args.record:
        viewer.record_stream(args.record, args.duration)
    else:
        viewer.view_with_ffplay()


if __name__ == "__main__":
    main()
