# ⚡ Trinetra AI Orchestrator - Quick Start

## 🚀 Setup (3 Steps)

### 1. Install Backend Dependencies
```bash
cd backend
pip install flask-socketio python-socketio
# Or reinstall all:
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install socket.io-client
```

### 3. Start Servers
```bash
# Terminal 1 - Backend
cd backend
python3 main.py

# Terminal 2 - Frontend  
cd frontend
npm start
```

---

## 🎮 Quick Test (2 Minutes)

### Step 1: Open Orchestrator
1. Open browser: `http://localhost:3000`
2. Connect wallet
3. Click `[AI-ORCHESTRATOR] 🤖`

### Step 2: Execute Command
1. Enter command: **"Book an Uber if the tennis court is dry"**
2. Click `[EXECUTE COMMAND]`
3. Watch the magic! ✨

**What happens:**
```
⚙️ PROCESSING...
  ↓
✅ Decomposing → Discovering → Executing → Synthesizing
  ↓
📊 EXECUTION SUMMARY
  • Task 1: CCTV Check ✅
  • Task 2: Wallet Check ✅  
  • Task 3: Uber Booking ✅
  ↓
🎉 FINAL RESULT
  ✅ Camera Analysis: Tennis court is dry (95% confidence)
  ✅ Sufficient Balance: $150.00
  🚗 Uber Booked! ID: UBER-12345, ETA: 8 minutes
```

---

## 💡 Try These Commands

### Easy Commands
```
"Check my wallet balance and the weather"
"Analyze the CCTV feed"
```

### Medium Commands
```
"Book an Uber if the tennis court is dry"
"Check wallet balance and book a ride if I have funds"
```

### Advanced Commands
```
"Analyze all cameras and book a ride if everything is safe"
"Check weather, wallet, and CCTV then decide if I should go out"
```

---

## 🔍 View Available Agents

Click `[VIEW AGENTS]` to see 8 AI agents:
- **VisionGuard Pro** (4.8★) - CCTV analysis
- **UberConnect Pro** (4.9★) - Ride booking
- **CryptoBalance Checker** (4.9★) - Wallet check
- And 5 more specialized agents!

---

## 🧪 Test API Directly

```bash
# Test command processing
curl -X POST http://localhost:5000/api/agent/process_command \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Check the weather"}'

# List available agents
curl http://localhost:5000/api/agent/list_agents

# Get marketplace stats
curl http://localhost:5000/api/agent/marketplace_stats
```

---

## ✅ Success Checklist

After running a command, you should see:
- [x] Command input accepted
- [x] "PROCESSING..." animation
- [x] Execution summary with 3+ tasks
- [x] Each task shows ✅ completed
- [x] Final result with emojis
- [x] Toast notification "Command executed successfully!"

---

## 🎯 What This Does

The AI Orchestrator:
1. **Understands** your natural language command
2. **Breaks it down** into subtasks (CCTV check, wallet check, booking)
3. **Finds AI agents** from Fitch Marketplace for each task
4. **Executes tasks** in the right order
5. **Makes decisions** (if court dry → book Uber)
6. **Returns result** in plain English

**All automatically, with one command!** 🤖✨

---

## 📚 More Info

- Full docs: `AI_ORCHESTRATION_GUIDE.md`
- Blockchain integration: `SUI_BLOCKCHAIN_INTEGRATION.md`
- CCTV setup: `CCTV_M3U8_FIX.md`

---

**You're ready to orchestrate AI agents!** 🚀
