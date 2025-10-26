from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import requests
import base64
import os
import face_recognition
from PIL import Image
from supabase import create_client, Client
import google.generativeai as genai
import json
import time
from dotenv import load_dotenv
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import re
from sui_integration import sui_blockchain, walrus_storage
from trinetra_agent import trinetra_agent
from fitch_marketplace import fitch_marketplace
from elasticsearch_integration import get_elasticsearch_manager

KNOWN_FACES_DIR = "known_faces"

# Import chromadb first, then load .env to avoid conflicts
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")  # WebSocket support
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini model for text generation
gemini_model = genai.GenerativeModel('gemini-pro')
# For vision tasks
gemini_vision_model = genai.GenerativeModel('gemini-1.5-flash')

#supabase
SUPABASE_URL = os.getenv("MY_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("MY_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Simple in-memory camera storage (chromadb has compatibility issues with Python 3.14)
class SimpleCameraCollection:
    def __init__(self):
        self.cameras = {}
    
    def add(self, ids, documents, metadatas, embeddings):
        for i, cam_id in enumerate(ids):
            self.cameras[cam_id] = {
                'document': documents[i] if i < len(documents) else '',
                'metadata': metadatas[i] if i < len(metadatas) else {},
                'embedding': embeddings[i] if i < len(embeddings) else []
            }
    
    def get(self, ids=None, include=None):
        if ids:
            result_ids = []
            result_metadatas = []
            for cam_id in ids:
                if cam_id in self.cameras:
                    result_ids.append(cam_id)
                    result_metadatas.append(self.cameras[cam_id]['metadata'])
            return {'ids': result_ids, 'metadatas': result_metadatas}
        else:
            return {
                'ids': list(self.cameras.keys()),
                'metadatas': [cam['metadata'] for cam in self.cameras.values()],
                'documents': [cam['document'] for cam in self.cameras.values()]
            }
    
    def query(self, query_embeddings, n_results=1):
        # Simple implementation - just return first n cameras
        cam_ids = list(self.cameras.keys())[:n_results]
        return {
            'ids': [cam_ids],
            'metadatas': [[self.cameras[cid]['metadata'] for cid in cam_ids]]
        }
    
    def delete(self, ids):
        for cam_id in ids:
            if cam_id in self.cameras:
                del self.cameras[cam_id]

camera_collection = SimpleCameraCollection()

# Initialize Elasticsearch manager
es_manager = get_elasticsearch_manager()


def getImage_Description(image_url):
    try:
        # Step 1: Download the image
        response = requests.get(image_url, stream=True)

        if response.status_code != 200:
            return f"Failed to download image, status code: {response.status_code}"

        # Step 2: Save image temporarily
        img_data = response.content
        temp_image_path = "temp_image.jpg"
        with open(temp_image_path, "wb") as f:
            f.write(img_data)

        # Step 3: Use Gemini Vision API for analysis
        from PIL import Image as PILImage
        img = PILImage.open(temp_image_path)
        
        response = gemini_vision_model.generate_content([
            "Describe what you see in this image in detail",
            img
        ])

        # Clean up temp file
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

        return response.text

    except Exception as e:
        # Clean up temp file in case of error
        if os.path.exists("temp_image.jpg"):
            os.remove("temp_image.jpg")
        return f"Error analyzing image: {str(e)}"
    

def GPT_Call(query):
    """
    Makes a call to the Gemini model with the given query.
    
    Args:
    query (str): The query to be passed to the Gemini model.
    
    Returns:
    dict: The response from the Gemini model.
    """
    try:
        # Add instruction to return JSON in the prompt
        prompt = f"{query}\n\nPlease respond with valid JSON only."
        response = gemini_model.generate_content(prompt)
        
        # Get the content of the response
        response_content = response.text
        
        # Try to parse the response as JSON
        try:
            # Clean up the response if it contains markdown code blocks
            if "```json" in response_content:
                response_content = response_content.split("```json")[1].split("```")[0].strip()
            elif "```" in response_content:
                response_content = response_content.split("```")[1].split("```")[0].strip()
            
            response_json = json.loads(response_content)
            return response_json
        except json.JSONDecodeError:
            # If the response is not valid JSON, return an error
            return {"error": "Invalid JSON response from Gemini model"}
    except Exception as e:
        # If there is an error making the call to the Gemini model, return an error
        return {"error": str(e)}
    
def embed_text(text):
    """
    Generate text embeddings using Gemini API
    """
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Error generating embedding: {str(e)}")
        # Return a zero vector as fallback
        return [0.0] * 768

@app.route('/api/hello-world')
def hello_world():
    return 'Hello, World!'

@app.route('/api/query_determine', methods=['POST'])
def query_determine():
    try:
        data = request.json
        if not data or 'prompt' not in data:
            return jsonify({'error': 'No prompt provided'}), 400
            
        query = "Return in valid JSON only. First, examine the following user query and determine if it states/matches any of the following locations: {382732:Denver, 1:Austin}. If it is, please return the index of the place in the json response in ‘location’ if no location exists, return -1. Finally, check if this requires a 'face_search' , return True of False. This query should be checking if the user is asking to get details on a face or not. Here is an example query “Find me the person who is on stage in ethDenver now” —> return JSON: {“location”:382732, “face_search”:true} explanation: we need 382732th location(denver) and we need face search to get the person. here is another example:  “Find me the person in orange jumpsuit escaping prison” —> return JSON: {“location”:-1, “face_search”:true}. Explanation: we cant search by location bc we dont know and it doesnt match the location searches,. we need face_search to get the face details. “Find the stolen red car” —> return JSON: {“location”:-1, “face_search”:false}. Explanation: we cant search by location bc we dont know and it doesnt match the location searches,. we cant use face_search because we arent searching for a specific face. thanks! USER QUERY:" + data['prompt'] 
        
        ret = GPT_Call(query)
        return jsonify(ret)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/search_cameras_description', methods=['POST'])
def search_camera_description():
    try:
        data = request.json
        if not data or "query" not in data:
            return jsonify({'error': 'No query provided'}), 400

        query_embedding = embed_text(data['query'])
        result = camera_collection.query(
            query_embeddings=[query_embedding],
            n_results=1
        )
        for cam_id, metadata in zip(result.get("ids", [])[0], result.get("metadatas", [])[0]):
            return jsonify({"uid": cam_id, **metadata})
        
        #we do it this way just to return first result
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/search_cameras_location', methods=['POST'])
def search_camera_location():
    try:
        # Parse the incoming JSON data
        data = request.json
        if not data or "uid" not in data:
            return jsonify({'error': 'No UID provided'}), 400

        # Extract the UID from the request
        camera_uid = data['uid']

        # Query the collection using the UID
        result = camera_collection.get(ids=[camera_uid])

        # Check if any result is found
        if not result.get("ids", []) or len(result["ids"]) == 0:
            return jsonify({'error': 'Camera not found'}), 404

        # Extract metadata for the first result
        cam_id = result["ids"][0]
        metadata = result["metadatas"][0]

        # Return the UID and metadata in JSON format
        return jsonify({"uid": cam_id, **metadata}), 200

    except Exception as e:
        # Handle any exceptions and return an error message
        return jsonify({'error': str(e)}), 500


# 2. Endpoint that returns all camera objects.
@app.route('/api/get_all_cameras', methods=['GET'])
def get_cameras():
    try:
        result = camera_collection.get(include=["metadatas", "documents"])
        cameras = []
        ids = result.get("ids", [])
        metadatas = result.get("metadatas", [])
        for cam_id, metadata in zip(ids, metadatas):
            cameras.append({"uid": cam_id, **metadata})
        return jsonify(cameras)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clear_db', methods=['GET'])
def clear_db():

    result = camera_collection.get(include=["metadatas", "documents"])
    cameras = []
    ids = result.get("ids", [])

    camera_collection.delete(
    ids=ids,
    )

    return jsonify({'message': 'Database cleared'}), 200


@app.route('/api/delete_cameras', methods=['POST'])
def delete_cameras():
    try:
        data = request.json
        if 'uids' not in data:
            return jsonify({'error': 'Missing required parameter: uids'}), 400
        uids = data['uids']
        if not isinstance(uids, list):
            return jsonify({'error': 'uids must be a list'}), 400

        # Check if the UIDs are valid and exist in the database
        result = camera_collection.get(include=["metadatas", "documents"])
        ids = result.get("ids", [])
        invalid_uids = [uid for uid in uids if uid not in ids]
        if invalid_uids:
            return jsonify({'error': f'Invalid UIDs: {invalid_uids}'}), 400

        camera_collection.delete(ids=uids)
        return jsonify({'message': 'Cameras deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/answer_query_no_face', methods=['POST'])
def answer_query_no_face():
    print("STARTED ANSWER QUERY NO FACE")

    try:
        data = request.get_json()
        if not data:
            print("ERROR: No JSON data received")
            return jsonify({"error": "No JSON data received"}), 400

        print("RECEIVED DATA:", data)  # Debugging log

        cam_data = data.get('cam')
        prompt = data.get('prompt')

        if not cam_data or not prompt:
            print("ERROR: Missing 'cam' or 'prompt' in request")
            return jsonify({"error": "Missing 'cam' or 'prompt'"}), 400

        print("GOT CAM DATA", cam_data)
        print("GOT PROMPT", prompt)

        image_url = cam_data.get('image_url')

        if not image_url:
            print("ERROR: No image URL provided")
            return jsonify({"error": "No image URL provided"}), 400

        # Step 1: Download the image
        response = requests.get(image_url, stream=True)

        if response.status_code != 200:
            print(f"Failed to download image, status code: {response.status_code}")
            return jsonify({"error": f"Failed to download image, status code: {response.status_code}"}), 500

        # Step 2: Save image temporarily
        img_data = response.content
        temp_image_path = "temp_query_image.jpg"
        with open(temp_image_path, "wb") as f:
            f.write(img_data)

        # Step 3: Use Gemini Vision API for analysis
        from PIL import Image as PILImage
        img = PILImage.open(temp_image_path)
        
        gemini_response = gemini_vision_model.generate_content([
            f"You have an image that will help answer the prompt. The user prompt: {prompt} and the image is shown below. Please provide a response to the user prompt using the image.",
            img
        ])

        # Clean up temp file
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

        return jsonify({"response": gemini_response.text})

    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        return jsonify({"error": f"Error analyzing image: {str(e)}"}), 500


@app.route('/api/add_camera', methods=['POST'])
def add_camera():
    try:
        data = request.json
        required_fields = ["uid", "location", "image_url", "description", "txHash", "ipId", "tokenId", "CID"]
        if any(field not in data for field in required_fields):
            print("missing fields")
            return jsonify({'error': 'Missing fields in request'}), 400


        image_frame_description = getImage_Description(data['image_url'])

        # Vector embed the description.
        embedding = embed_text(data['description'] + image_frame_description)

        # Add camera stream to the Chroma collection.
        camera_collection.add(
            documents=[data['description']],
            metadatas=[{
                "location": data['location'],
                "image_url": data['image_url'],
                "description": data['description'] + image_frame_description,            
                "txHash": data['txHash'],
                "ipId": data['ipId'],
                "tokenId": data['tokenId'],
                "CID": data['CID']
            }],
            ids=[data['uid']],
            embeddings=[embedding]
        )
        
        # Log to Elasticsearch
        if es_manager:
            try:
                es_manager.log_cctv_footage(
                    camera_id=data['uid'],
                    camera_name=data['description'],
                    location=data['location'],
                    stream_url=data['image_url'],
                    metadata={
                        "ipId": data['ipId'],
                        "tokenId": data['tokenId']
                    },
                    tx_hash=data['txHash'],
                    ipfs_cid=data['CID']
                )
                es_manager.log_transaction(
                    transaction_type="camera_registration",
                    user_address=data.get('user_address', 'unknown'),
                    blockchain="sui",
                    tx_hash=data['txHash'],
                    status="success",
                    details={
                        "camera_id": data['uid'],
                        "ipId": data['ipId'],
                        "tokenId": data['tokenId'],
                        "CID": data['CID']
                    },
                    related_camera_id=data['uid']
                )
            except Exception as es_error:
                print(f"⚠️ Failed to log to Elasticsearch: {es_error}")
        
        return jsonify({'message': 'Camera added successfully'}), 200
    except Exception as e:
        print(f"Error adding camera: {str(e)}")
        return jsonify({'error': str(e)}), 500



def download_image(image_url):
    """Downloads an image from a URL and saves it locally."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(image_url, headers=headers, stream=True, allow_redirects=True)
        response.raise_for_status()  # Raise error if request fails
        
        image_path = "input_image.jpg"
        with open(image_path, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        return image_path
    except requests.exceptions.RequestException as e:
        print(f"Error downloading image: {e}")
        return None

def encode_known_faces():
    """Encodes all known faces and returns a dictionary {name: encoding}."""
    known_encodings = {}
    
    for filename in os.listdir(KNOWN_FACES_DIR):
        filepath = os.path.join(KNOWN_FACES_DIR, filename)
        if not filename.endswith(('.jpg', '.jpeg', '.png')):
            continue
        
        name = os.path.splitext(filename)[0]  # Extract name from filename
        image = face_recognition.load_image_file(filepath)
        encodings = face_recognition.face_encodings(image)

        if encodings:
            known_encodings[name] = encodings[0]
    
    return known_encodings

def recognize_faces(image_path, known_encodings):
    """Compares an input image with known faces and returns the closest match."""
    unknown_image = face_recognition.load_image_file(image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if not unknown_encodings:
        return None  # No face detected in the input image.

    unknown_encoding = unknown_encodings[0]
    
    for name, known_encoding in known_encodings.items():
        match = face_recognition.compare_faces([known_encoding], unknown_encoding, tolerance=0.6)
        if match[0]:
            return name  # Match found
    
    return None  # No match found.

@app.route('/api/answer_query_face', methods=['POST'])
def answer_query_face():
    try:
        data = request.get_json()
        if not data:
            print("ERROR: No JSON data received")
            return jsonify({"error": "No JSON data received"}), 400
        
        print("RECEIVED DATA:", data)  # Debugging log
        cam_url = data.get('cam_url')
        
        if not cam_url:
            print("ERROR: No cam_url provided")
            return jsonify({"error": "No cam_url provided"}), 400
        
        # Step 1: Download the image from the URL
        print("Downloading image from URL...")
        image_path = download_image(cam_url)
        
        if not image_path:
            return jsonify({"error": "Failed to download image from URL"}), 500
        
        # Step 2: Encode known faces
        print("Encoding known faces...")
        known_faces = encode_known_faces()
        
        # Step 3: Recognize faces in the downloaded image
        print("Recognizing faces...")
        recognized_name = recognize_faces(image_path, known_faces)
        
        if not recognized_name:
            recognized_name = "Unknown"  # Default value if no match is found
        
        print("HYPER ANSWER:", recognized_name)

        # Step 4: Use Gemini to get additional information about the person
        prompt = f"NAME: {recognized_name}. Given someone's name, try to find details about them, such as age, profession, LinkedIn, Twitter. Return with no extra words and include name. If you cannot find information, just return CANNOT FIND for each field. Return in this format:\nNAME: Bob\nAGE: 22\nPROFESSION: Software Engineer\nLINKEDIN: https://linkedin.com/bob\nTWITTER: https://twitter.com/bob"
        
        response = gemini_model.generate_content(prompt)
        
        print(response)
        
        # Extract and return the response content
        result_content = response.text
        print(result_content)

        return jsonify({"response": result_content})

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({'error': str(e)}), 500
    # Email and Agent functionality removed as per user requirements


# CCTV Stream Management Endpoints
def validate_m3u8_url(url):
    """Validate if an .m3u8 URL is accessible and returns a valid playlist"""
    try:
        print(f"Validating m3u8 URL: {url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
        }
        
        # Try to fetch the playlist
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        
        if response.status_code == 200:
            content = response.text.lower()
            # Check if it's a valid m3u8 playlist
            if '#extm3u' in content or '#ext-x-' in content:
                print(f"✓ Valid .m3u8 playlist found")
                return True, "Valid HLS stream"
            else:
                print(f"✗ URL returned 200 but not a valid m3u8 playlist")
                return False, "Not a valid HLS playlist"
        else:
            print(f"✗ URL returned status code: {response.status_code}")
            return False, f"HTTP {response.status_code}"
    except requests.exceptions.Timeout:
        print(f"✗ Timeout accessing URL")
        return False, "Request timeout"
    except requests.exceptions.RequestException as e:
        print(f"✗ Error accessing URL: {str(e)}")
        return False, f"Connection error: {str(e)}"
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")
        return False, f"Error: {str(e)}"


@app.route('/api/analyze_cctv_url', methods=['POST'])
def analyze_cctv_url():
    """Analyze a webpage URL to extract CCTV stream URLs"""
    try:
        data = request.json
        webpage_url = data.get('url')
        
        if not webpage_url:
            return jsonify({'error': 'No URL provided'}), 400
        
        # Clean and normalize the URL
        webpage_url = webpage_url.strip()
        
        print(f"\nAnalyzing CCTV URL: {webpage_url}")
        
        # Check if it's a direct stream URL
        stream_extensions = ['.m3u8', '.mpd', '.ts', '.mp4', '.flv', '.mjpeg', '.mjpg']
        stream_protocols = ['rtsp://', 'rtmp://', 'mms://', 'mmsh://']
        
        url_lower = webpage_url.lower()
        
        # Check for direct stream
        is_direct = False
        stream_type = 'unknown'
        
        for protocol in stream_protocols:
            if url_lower.startswith(protocol):
                is_direct = True
                stream_type = protocol.replace('://', '').upper()
                break
        
        if not is_direct:
            for ext in stream_extensions:
                if ext in url_lower:
                    is_direct = True
                    if ext == '.m3u8':
                        stream_type = 'HLS'
                    elif ext == '.mpd':
                        stream_type = 'DASH'
                    elif ext == '.mp4':
                        stream_type = 'MP4'
                    else:
                        stream_type = ext.upper()
                    break
        
        if is_direct:
            print(f"✓ Direct stream URL detected! Type: {stream_type}")
            
            # Validate .m3u8 streams
            if '.m3u8' in url_lower:
                is_valid, message = validate_m3u8_url(webpage_url)
                if is_valid:
                    return jsonify({
                        'success': True,
                        'stream_urls': [webpage_url],
                        'type': 'direct',
                        'stream_type': stream_type,
                        'validated': True,
                        'message': 'HLS stream validated successfully'
                    })
                else:
                    return jsonify({
                        'success': False,
                        'error': f'Invalid or inaccessible .m3u8 stream: {message}',
                        'stream_urls': [webpage_url],
                        'validated': False
                    }), 400
            
            # For other stream types, return without validation
            return jsonify({
                'success': True,
                'stream_urls': [webpage_url],
                'type': 'direct',
                'stream_type': stream_type,
                'validated': False,
                'message': f'{stream_type} stream detected (validation skipped)'
            })
        
        # Try to parse the webpage
        print("Fetching webpage content...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(webpage_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        stream_urls = []
        
        print("✓ Webpage fetched! Searching for video sources...")
        
        # Find video tags
        videos = soup.find_all('video')
        for video in videos:
            src = video.get('src')
            if src:
                full_url = urljoin(webpage_url, src)
                stream_urls.append(full_url)
            
            # Check source tags within video
            sources = video.find_all('source')
            for source in sources:
                src = source.get('src')
                if src:
                    full_url = urljoin(webpage_url, src)
                    stream_urls.append(full_url)
        
        # Find iframe tags
        iframes = soup.find_all('iframe')
        for iframe in iframes:
            src = iframe.get('src')
            if src and any(ext in src.lower() for ext in stream_extensions):
                full_url = urljoin(webpage_url, src)
                stream_urls.append(full_url)
        
        # Search for .m3u8 URLs in script tags and page source
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                # Find m3u8 URLs (more comprehensive pattern)
                m3u8_matches = re.findall(r'https?://[^\s<>"\']+?\.m3u8[^\s<>"\']*', script.string)
                stream_urls.extend(m3u8_matches)
        
        # Also search in the entire HTML source for m3u8 URLs
        all_m3u8 = re.findall(r'https?://[^\s<>"\']+?\.m3u8[^\s<>"\']*', response.text)
        stream_urls.extend(all_m3u8)
        
        # Remove duplicates and clean URLs
        stream_urls = list(set(stream_urls))
        
        # Validate each .m3u8 URL found
        validated_streams = []
        for url in stream_urls:
            if '.m3u8' in url.lower():
                is_valid, message = validate_m3u8_url(url)
                if is_valid:
                    validated_streams.append(url)
                    print(f"✓ Validated: {url}")
                else:
                    print(f"✗ Invalid: {url} - {message}")
            else:
                validated_streams.append(url)  # Keep non-m3u8 URLs without validation
        
        stream_urls = validated_streams
        
        if stream_urls:
            print(f"✓ Found {len(stream_urls)} stream URL(s)")
            return jsonify({
                'success': True,
                'stream_urls': stream_urls,
                'type': 'webpage'
            })
        else:
            print("✗ No stream URLs found")
            return jsonify({
                'success': False,
                'error': 'No stream URLs found on this webpage',
                'stream_urls': []
            }), 404
    
    except requests.exceptions.RequestException as e:
        print(f"✗ Request error: {e}")
        return jsonify({'error': f'Failed to fetch webpage: {str(e)}'}), 500
    except Exception as e:
        print(f"✗ Error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/get_cctv_streams', methods=['GET'])
def get_cctv_streams():
    """Get all stored CCTV stream URLs from camera database"""
    try:
        result = camera_collection.get(include=["metadatas", "documents"])
        cameras = []
        
        for i, metadata in enumerate(result['metadatas']):
            camera = {
                'uid': metadata.get('uid'),
                'stream_url': metadata.get('image_url'),  # Using image_url field for stream URL
                'description': result['documents'][i] if i < len(result['documents']) else '',
                'location': metadata.get('location', '')
            }
            cameras.append(camera)
        
        return jsonify({'cameras': cameras})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# SUI BLOCKCHAIN INTEGRATION ENDPOINTS
# ============================================

@app.route('/api/sui/register_camera', methods=['POST'])
def sui_register_camera():
    """Register a camera on Sui blockchain"""
    try:
        data = request.json
        camera_uid = data.get('uid')
        location = data.get('location')
        stream_url = data.get('stream_url', data.get('image_url', ''))
        
        if not camera_uid or not location:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Register on Sui blockchain
        result = sui_blockchain.register_camera_onchain(
            camera_uid=camera_uid,
            location=location,
            stream_url=stream_url
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sui/create_verification', methods=['POST'])
def sui_create_verification():
    """Create a verification request on Sui blockchain with Walrus storage"""
    try:
        data = request.json
        camera_uid = data.get('camera_uid')
        request_type = data.get('request_type', 'ai_analysis')
        ai_result = data.get('ai_result', '')
        image_data = data.get('image_data', '')
        
        if not camera_uid:
            return jsonify({'error': 'Camera UID required'}), 400
        
        # Store image in Walrus if provided
        walrus_blob_id = "no_image"
        if image_data:
            walrus_result = walrus_storage.store_image(
                image_data=image_data,
                metadata={
                    "camera_uid": camera_uid,
                    "request_type": request_type,
                    "timestamp": int(time.time() * 1000)
                }
            )
            if walrus_result.get('success'):
                walrus_blob_id = walrus_result['blob_id']
        
        # Create verification request on Sui
        verification_result = sui_blockchain.create_verification_request(
            camera_uid=camera_uid,
            request_type=request_type,
            walrus_blob_id=walrus_blob_id,
            ai_result=ai_result,
            image_data=image_data
        )
        
        # Include Walrus info
        if walrus_blob_id != "no_image":
            verification_result['walrus_url'] = f"https://walrus-testnet.mystenlabs.com/v1/{walrus_blob_id}"
        
        return jsonify(verification_result)
    except Exception as e:
        print(f"Error creating verification: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/sui/verify_request', methods=['POST'])
def sui_verify_request():
    """Verify a request on Sui blockchain"""
    try:
        data = request.json
        request_id = data.get('request_id')
        
        if not request_id:
            return jsonify({'error': 'Request ID required'}), 400
        
        result = sui_blockchain.verify_request(request_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sui/verification_status/<request_id>', methods=['GET'])
def sui_verification_status(request_id):
    """Get verification request status"""
    try:
        result = sui_blockchain.get_verification_status(request_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sui/camera_verifications/<camera_uid>', methods=['GET'])
def sui_camera_verifications(camera_uid):
    """Get all verifications for a camera"""
    try:
        result = sui_blockchain.get_camera_verifications(camera_uid)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/walrus/store', methods=['POST'])
def walrus_store():
    """Store data in Walrus"""
    try:
        data = request.json
        content = data.get('content', '')
        metadata = data.get('metadata', {})
        
        result = walrus_storage.store_image(content, metadata)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/walrus/retrieve/<blob_id>', methods=['GET'])
def walrus_retrieve(blob_id):
    """Retrieve data from Walrus"""
    try:
        result = walrus_storage.retrieve_image(blob_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sui/blockchain_stats', methods=['GET'])
def sui_blockchain_stats():
    """Get blockchain statistics"""
    try:
        stats = {
            "total_cameras": len(sui_blockchain.mock_cameras),
            "total_verifications": len(sui_blockchain.mock_verifications),
            "network": "Sui Testnet (Mock)",
            "package_id": sui_blockchain.package_id,
            "registry_id": sui_blockchain.registry_id,
            "walrus_blobs": len(walrus_storage.mock_blobs),
            "recent_verifications": list(sui_blockchain.mock_verifications.values())[-5:],
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# TRINETRA AGENT ORCHESTRATION ENDPOINTS
# ============================================

@app.route('/api/agent/process_command', methods=['POST'])
def agent_process_command():
    """Process a high-level user command through Trinetra Agent"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        print(f"\n🤖 Trinetra Agent Processing: {prompt}")
        
        # Process through main agent
        result = trinetra_agent.process_user_prompt(prompt)
        
        # Emit real-time update via WebSocket
        if result.get('success'):
            socketio.emit('agent_update', {
                'type': 'completion',
                'data': result
            })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Agent processing error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/agent/context_status/<context_id>', methods=['GET'])
def agent_context_status(context_id):
    """Get status of an agent execution context"""
    try:
        status = trinetra_agent.get_context_status(context_id)
        if status:
            return jsonify({'success': True, 'status': status})
        else:
            return jsonify({'success': False, 'error': 'Context not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/agent/list_agents', methods=['GET'])
def agent_list_agents():
    """List all available agents from Fitch Marketplace"""
    try:
        category = request.args.get('category')
        agents = trinetra_agent.list_available_agents(category)
        return jsonify({
            'success': True,
            'agents': agents,
            'total': len(agents)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/agent/marketplace_stats', methods=['GET'])
def agent_marketplace_stats():
    """Get Fitch Marketplace statistics"""
    try:
        stats = trinetra_agent.get_marketplace_stats()
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fitch/search_agents', methods=['POST'])
def fitch_search_agents():
    """Search Fitch Marketplace for agents"""
    try:
        data = request.json
        query = data.get('query', '')
        capability = data.get('capability')
        min_rating = data.get('min_rating', 0.0)
        
        agents = fitch_marketplace.search_agents(query, capability, min_rating)
        
        return jsonify({
            'success': True,
            'agents': [agent.to_dict() for agent in agents],
            'total': len(agents)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fitch/find_agent/<task>', methods=['GET'])
def fitch_find_agent(task):
    """Find best agents for a specific task"""
    try:
        top_k = request.args.get('top_k', 3, type=int)
        agents = fitch_marketplace.find_agent(task, top_k)
        
        return jsonify({
            'success': True,
            'task': task,
            'agents': agents
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# WebSocket events for real-time agent updates
@socketio.on('connect')
def handle_connect():
    print('Client connected to Trinetra Agent')
    emit('connection_response', {'status': 'connected'})


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected from Trinetra Agent')


@socketio.on('subscribe_agent_updates')
def handle_subscribe(data):
    context_id = data.get('context_id')
    print(f'Client subscribed to updates for context: {context_id}')
    emit('subscription_confirmed', {'context_id': context_id})


# ============= ELASTICSEARCH ENDPOINTS =============

@app.route('/api/elasticsearch/cctv_logs', methods=['GET'])
def get_cctv_logs():
    """Get CCTV footage logs from Elasticsearch"""
    if not es_manager:
        return jsonify({'error': 'Elasticsearch not configured'}), 503
    
    try:
        camera_id = request.args.get('camera_id')
        start_time = request.args.get('start_time')
        end_time = request.args.get('end_time')
        limit = int(request.args.get('limit', 100))
        
        logs = es_manager.search_cctv_footage(camera_id, start_time, end_time, limit)
        
        return jsonify({
            'success': True,
            'logs': logs,
            'total': len(logs)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/elasticsearch/ai_analysis', methods=['GET'])
def get_ai_analysis():
    """Get AI analysis results from Elasticsearch"""
    if not es_manager:
        return jsonify({'error': 'Elasticsearch not configured'}), 503
    
    try:
        camera_id = request.args.get('camera_id')
        analysis_type = request.args.get('analysis_type')
        min_confidence = float(request.args.get('min_confidence', 0)) if request.args.get('min_confidence') else None
        limit = int(request.args.get('limit', 100))
        
        analysis = es_manager.search_ai_analysis(camera_id, analysis_type, min_confidence, limit)
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'total': len(analysis)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/elasticsearch/transactions', methods=['GET'])
def get_transactions():
    """Get blockchain transactions from Elasticsearch"""
    if not es_manager:
        return jsonify({'error': 'Elasticsearch not configured'}), 503
    
    try:
        user_address = request.args.get('user_address')
        tx_hash = request.args.get('tx_hash')
        transaction_type = request.args.get('transaction_type')
        limit = int(request.args.get('limit', 100))
        
        transactions = es_manager.search_transactions(user_address, tx_hash, transaction_type, limit)
        
        return jsonify({
            'success': True,
            'transactions': transactions,
            'total': len(transactions)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/elasticsearch/analytics', methods=['GET'])
def get_analytics():
    """Get analytics summary from Elasticsearch"""
    if not es_manager:
        return jsonify({'error': 'Elasticsearch not configured'}), 503
    
    try:
        summary = es_manager.get_analytics_summary()
        
        return jsonify({
            'success': True,
            'analytics': summary
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/elasticsearch/log_analysis', methods=['POST'])
def log_analysis_manual():
    """Manually log an AI analysis result to Elasticsearch"""
    if not es_manager:
        return jsonify({'error': 'Elasticsearch not configured'}), 503
    
    try:
        data = request.json
        doc_id = es_manager.log_ai_analysis(
            camera_id=data['camera_id'],
            analysis_type=data['analysis_type'],
            result=data['result'],
            confidence=data.get('confidence', 0.0),
            agent_id=data.get('agent_id', 'manual'),
            agent_name=data.get('agent_name', 'Manual Entry'),
            processing_time_ms=data.get('processing_time_ms', 0),
            gemini_used=data.get('gemini_used', False),
            frames_analyzed=data.get('frames_analyzed', 0),
            detected_objects=data.get('detected_objects'),
            conditions=data.get('conditions')
        )
        
        return jsonify({
            'success': True,
            'document_id': doc_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
