# 🚀 Trinetra - Complete Installation & Run Guide

## ⚡ Quick Install (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
cd /Users/joker2307/Desktop/unagi/backend
pip install -r requirements.txt
```

**New dependencies added:**
- `flask-socketio` - WebSocket server
- `python-socketio` - Socket.IO support

### Step 2: Install Frontend Dependencies  
```bash
cd /Users/joker2307/Desktop/unagi/frontend
npm install socket.io-client
```

### Step 3: Start Backend
```bash
cd /Users/joker2307/Desktop/unagi/backend
python3 main.py
```

✅ **Expected output:**
```
* Running on http://127.0.0.1:5000
* WebSocket server running
```

### Step 4: Start Frontend (New Terminal)
```bash
cd /Users/joker2307/Desktop/unagi/frontend
npm start
```

✅ **Expected output:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Step 5: Open Browser
Navigate to: `http://localhost:3000`

---

## 🎮 Test All Features (10 Minutes)

### 1. Test CCTV System ✅
```
1. Click [INIT-CAMERA-PROTOCOL]
2. Enter URL: https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af
3. Click [ANALYZE URL]
4. Enter coords: 37.7749,-122.4194
5. Enter desc: "Test Camera"
6. Click [COMMIT]
7. Click [OPEN-CCTV] → See live stream
```

**Expected:**
- ✅ "Found 1 stream(s)! (HLS) ✓ Validated"
- ✅ Camera registered on blockchain
- ✅ Live feed playing

### 2. Test Blockchain Verification ✅
```
1. Enter query: "What do you see?"
2. Click Submit
3. See toast: "Verification recorded on Sui! TX: 0x..."
4. Click [BLOCKCHAIN-VERIFY]
5. See stats updated
6. Click verification → See details
```

**Expected:**
- ✅ AI analysis result
- ✅ Blockchain verification created
- ✅ Transaction hash displayed
- ✅ Dashboard shows verification

### 3. Test AI Orchestration ✅
```
1. Click [AI-ORCHESTRATOR] 🤖
2. Enter: "Book an Uber if the tennis court is dry"
3. Click [EXECUTE COMMAND]
4. Watch execution flow
5. See final result
```

**Expected:**
- ✅ Task decomposition visible
- ✅ 3 tasks executed
- ✅ Final result with emojis
- ✅ Toast "Command executed successfully!"

---

## 📋 Full Feature Checklist

### Core Features
- [x] CCTV Camera Management
- [x] HLS Stream Validation (.m3u8)
- [x] Live CCTV Grid (3x3)
- [x] AI Analysis (Gemini)
- [x] Face Recognition
- [x] Interactive Map
- [x] Query System

### Blockchain Features
- [x] Sui Smart Contracts
- [x] Automatic Verification
- [x] Walrus Storage
- [x] Transaction Tracking
- [x] Verification Dashboard
- [x] Sui Explorer Integration

### AI Orchestration Features
- [x] Multi-Agent System
- [x] Fitch Marketplace
- [x] Task Decomposition
- [x] Conditional Execution
- [x] Real-time WebSocket Updates
- [x] Agent Discovery
- [x] Execution Visualization

### UI Features
- [x] Cyberpunk Terminal
- [x] Boot Sequence Animation
- [x] Toast Notifications
- [x] Real-time Dashboards
- [x] WebSocket Live Updates
- [x] Responsive Design

---

## 🔧 Troubleshooting

### Issue: "Module not found: flask_socketio"
```bash
pip install flask-socketio python-socketio
```

### Issue: "socket.io-client not found"
```bash
cd frontend
npm install socket.io-client
```

### Issue: "Port 5000 already in use"
```bash
# Kill existing process
lsof -ti:5000 | xargs kill -9

# Or change port in main.py:
socketio.run(app, debug=True, port=5001)
```

### Issue: "Blockchain dashboard shows 0 verifications"
```bash
# Test API
curl http://localhost:5000/api/sui/blockchain_stats

# Should return JSON with stats
```

### Issue: "AI Orchestrator not responding"
```bash
# Check backend logs
# Look for: "Trinetra Agent Processing..."

# Test API directly
curl -X POST http://localhost:5000/api/agent/process_command \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

---

## 📊 Verify Installation

### Backend Health Check
```bash
# Test endpoints
curl http://localhost:5000/api/sui/blockchain_stats
curl http://localhost:5000/api/agent/marketplace_stats
curl http://localhost:5000/api/agent/list_agents
```

### Frontend Health Check
- Open: http://localhost:3000
- Check browser console (F12)
- Should see: "Connected to Trinetra Agent"
- No errors in console

### WebSocket Health Check
```bash
# In browser console:
// Should show connection messages
```

---

## 🎯 What Works Now

### 1. CCTV System
- ✅ Add cameras with .m3u8 URLs
- ✅ Validate HLS streams
- ✅ View live feeds in grid
- ✅ Register cameras on Sui blockchain

### 2. AI Analysis
- ✅ Natural language queries
- ✅ Face recognition
- ✅ Scene understanding
- ✅ Automatic blockchain verification

### 3. Blockchain
- ✅ Sui smart contracts (mock mode)
- ✅ Automatic verification recording
- ✅ Transaction hash generation
- ✅ Walrus storage simulation
- ✅ Real-time dashboard

### 4. AI Orchestration
- ✅ Multi-agent coordination
- ✅ Task decomposition (LLM)
- ✅ Conditional execution
- ✅ 8 specialized agents
- ✅ Real-time execution updates

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `COMPLETE_SYSTEM_SUMMARY.md` | Complete overview |
| `AI_ORCHESTRATION_GUIDE.md` | AI agent orchestration |
| `SUI_BLOCKCHAIN_INTEGRATION.md` | Blockchain integration |
| `AGENT_QUICKSTART.md` | Quick agent start |
| `BLOCKCHAIN_QUICKSTART.md` | Quick blockchain start |
| `CCTV_M3U8_FIX.md` | CCTV streaming guide |
| `DEMO_SCRIPT.md` | Demo presentation |

---

## 🚀 Next Steps

### For Development
1. Read `COMPLETE_SYSTEM_SUMMARY.md`
2. Explore API endpoints
3. Test all features
4. Customize agents

### For Demo
1. Read `DEMO_SCRIPT.md`
2. Prepare test commands
3. Have sample .m3u8 URLs ready
4. Practice workflow

### For Production
1. Deploy Sui smart contracts
2. Configure real Fitch Marketplace
3. Set up Walrus storage
4. Configure production servers

---

## ✅ Success Indicators

After installation, you should have:

**Backend:**
- ✅ Server running on port 5000
- ✅ WebSocket server active
- ✅ All imports successful
- ✅ No errors in console

**Frontend:**
- ✅ App running on port 3000
- ✅ Socket.IO connected
- ✅ All components loading
- ✅ No errors in console

**Features:**
- ✅ Can add cameras
- ✅ Can view CCTV grid
- ✅ Can query AI
- ✅ Blockchain verifications work
- ✅ AI Orchestrator executes commands

---

## 🎉 You're Ready!

**Trinetra is now fully installed and running with:**

✨ CCTV Management  
✨ AI Analysis  
✨ Blockchain Verification  
✨ AI Orchestration  
✨ Real-time Updates  

**Start by clicking `[AI-ORCHESTRATOR] 🤖` and entering:**
```
"Book an Uber if the tennis court is dry"
```

**Watch the magic happen!** 🚀✨

---

*Need help? Check the troubleshooting section or documentation files.*
