#!/usr/bin/env python3
"""
Robust CCTV Stream Viewer with FFmpeg backend
Provides continuous, gap-free streaming with advanced error recovery
"""

import cv2
import subprocess
import threading
import queue
import time
import argparse
import numpy as np
from collections import deque


class RobustStreamViewer:
    def __init__(self, stream_url, buffer_size=30, reconnect_delay=2):
        self.stream_url = stream_url
        self.buffer_size = buffer_size
        self.reconnect_delay = reconnect_delay
        self.running = False
        self.frame_queue = queue.Queue(maxsize=buffer_size)
        self.capture_thread = None
        self.display_thread = None
        self.stats = {
            'frames_captured': 0,
            'frames_displayed': 0,
            'reconnections': 0,
            'buffer_underruns': 0,
            'fps': 0
        }
        self.last_frame_time = time.time()
        self.fps_buffer = deque(maxlen=30)
        
    def capture_frames(self):
        """Capture frames from stream with automatic reconnection"""
        while self.running:
            try:
                print(f"\n{'='*60}")
                print("Connecting to stream...")
                print(f"{'='*60}")
                
                # Create VideoCapture with optimized settings
                cap = cv2.VideoCapture(self.stream_url, cv2.CAP_FFMPEG)
                
                # Set buffer size and threading
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 3)
                
                if not cap.isOpened():
                    print("✗ Failed to open stream, retrying...")
                    self.stats['reconnections'] += 1
                    time.sleep(self.reconnect_delay)
                    continue
                
                print("✓ Connected to stream!")
                consecutive_failures = 0
                max_consecutive_failures = 10
                
                while self.running:
                    ret, frame = cap.read()
                    
                    if not ret:
                        consecutive_failures += 1
                        print(f"✗ Frame read failed ({consecutive_failures}/{max_consecutive_failures})")
                        
                        if consecutive_failures >= max_consecutive_failures:
                            print("Too many failures, reconnecting...")
                            break
                        
                        time.sleep(0.1)
                        continue
                    
                    # Reset failure counter on success
                    consecutive_failures = 0
                    self.stats['frames_captured'] += 1
                    
                    # Try to add frame to queue, drop oldest if full
                    try:
                        self.frame_queue.put(frame, block=False)
                    except queue.Full:
                        # Queue full, drop oldest frame
                        try:
                            self.frame_queue.get_nowait()
                            self.frame_queue.put(frame, block=False)
                        except:
                            pass
                
                cap.release()
                
            except Exception as e:
                print(f"✗ Capture error: {e}")
                self.stats['reconnections'] += 1
                
            if self.running:
                print(f"Reconnecting in {self.reconnect_delay} seconds...")
                time.sleep(self.reconnect_delay)
    
    def display_frames(self):
        """Display frames with smooth playback"""
        window_name = 'CCTV Stream - Press Q to quit'
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        
        last_frame = None
        frame_time = 1.0 / 30  # Target 30 FPS
        
        while self.running:
            try:
                # Get frame from queue with timeout
                frame = self.frame_queue.get(timeout=1.0)
                last_frame = frame.copy()
                
                # Calculate FPS
                current_time = time.time()
                delta = current_time - self.last_frame_time
                if delta > 0:
                    fps = 1.0 / delta
                    self.fps_buffer.append(fps)
                    self.stats['fps'] = sum(self.fps_buffer) / len(self.fps_buffer)
                self.last_frame_time = current_time
                
                # Update stats
                self.stats['frames_displayed'] += 1
                
                # Add overlay with stats
                self.add_overlay(frame)
                
                # Display frame
                cv2.imshow(window_name, frame)
                
                # Control display rate
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("\nUser requested quit")
                    self.running = False
                    break
                    
            except queue.Empty:
                # Buffer underrun - show last frame or warning
                self.stats['buffer_underruns'] += 1
                
                if last_frame is not None:
                    # Show last frame with warning
                    display_frame = last_frame.copy()
                    cv2.putText(display_frame, "BUFFERING...", (50, 100),
                               cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
                    cv2.imshow(window_name, display_frame)
                    
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    self.running = False
                    break
                    
            except Exception as e:
                print(f"✗ Display error: {e}")
                break
        
        cv2.destroyAllWindows()
    
    def add_overlay(self, frame):
        """Add information overlay to frame"""
        h, w = frame.shape[:2]
        
        # Create semi-transparent overlay bar
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 120), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.5, frame, 0.5, 0, frame)
        
        # Add text
        font = cv2.FONT_HERSHEY_SIMPLEX
        color = (0, 255, 0)
        
        cv2.putText(frame, f"FPS: {self.stats['fps']:.1f}", (10, 30),
                   font, 0.7, color, 2)
        cv2.putText(frame, f"Buffer: {self.frame_queue.qsize()}/{self.buffer_size}", (10, 60),
                   font, 0.7, color, 2)
        cv2.putText(frame, f"Captured: {self.stats['frames_captured']}", (10, 90),
                   font, 0.7, color, 2)
        
        if self.stats['reconnections'] > 0:
            cv2.putText(frame, f"Reconnects: {self.stats['reconnections']}", (250, 30),
                       font, 0.7, (0, 165, 255), 2)
        
        if self.stats['buffer_underruns'] > 0:
            cv2.putText(frame, f"Underruns: {self.stats['buffer_underruns']}", (250, 60),
                       font, 0.7, (0, 165, 255), 2)
        
        cv2.putText(frame, "Press 'Q' to quit", (w - 250, 30),
                   font, 0.7, (255, 255, 255), 2)
    
    def start(self):
        """Start the stream viewer"""
        print("\n" + "="*60)
        print("ROBUST CCTV STREAM VIEWER")
        print("="*60)
        print(f"\nStream URL: {self.stream_url}")
        print(f"Buffer Size: {self.buffer_size} frames")
        print(f"Reconnect Delay: {self.reconnect_delay}s")
        print("\nStarting viewer...")
        
        self.running = True
        
        # Start capture thread
        self.capture_thread = threading.Thread(target=self.capture_frames, daemon=True)
        self.capture_thread.start()
        
        # Wait for initial buffer fill
        print("Filling buffer...")
        while self.frame_queue.qsize() < min(5, self.buffer_size) and self.running:
            time.sleep(0.1)
        
        print("✓ Buffer filled, starting playback!\n")
        
        # Start display in main thread
        try:
            self.display_frames()
        except KeyboardInterrupt:
            print("\n\nInterrupted by user")
        finally:
            self.stop()
    
    def stop(self):
        """Stop the stream viewer"""
        print("\nStopping viewer...")
        self.running = False
        
        if self.capture_thread and self.capture_thread.is_alive():
            self.capture_thread.join(timeout=2)
        
        # Print final stats
        print("\n" + "="*60)
        print("SESSION STATISTICS")
        print("="*60)
        print(f"Frames Captured:  {self.stats['frames_captured']}")
        print(f"Frames Displayed: {self.stats['frames_displayed']}")
        print(f"Reconnections:    {self.stats['reconnections']}")
        print(f"Buffer Underruns: {self.stats['buffer_underruns']}")
        print(f"Average FPS:      {self.stats['fps']:.1f}")
        print("="*60)


def main():
    parser = argparse.ArgumentParser(
        description='Robust CCTV Stream Viewer with automatic reconnection',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python stream_viewer.py "rtsp://camera-ip:554/stream"
  python stream_viewer.py "https://example.com/stream.m3u8" --buffer 60
  python stream_viewer.py "https://example.com/stream.m3u8" --reconnect-delay 5

Tennis Courts Example:
  python stream_viewer.py "https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af"
        """
    )
    
    parser.add_argument('url', help='Stream URL (HLS, RTSP, HTTP, etc.)')
    parser.add_argument('--buffer', '-b', type=int, default=30,
                       help='Buffer size in frames (default: 30)')
    parser.add_argument('--reconnect-delay', '-r', type=float, default=2.0,
                       help='Delay between reconnection attempts in seconds (default: 2.0)')
    
    args = parser.parse_args()
    
    # Create and start viewer
    viewer = RobustStreamViewer(
        stream_url=args.url,
        buffer_size=args.buffer,
        reconnect_delay=args.reconnect_delay
    )
    
    viewer.start()


if __name__ == "__main__":
    main()
