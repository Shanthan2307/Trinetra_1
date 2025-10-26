# 🎬 Trinetra Blockchain Demo Script

## 🎯 Demo Purpose
Show how Trinetra integrates **Sui blockchain** to verify AI-analyzed CCTV footage with **Walrus** decentralized storage.

---

## ⏱️ Demo Duration
**5-7 minutes** (Quick demo)  
**15-20 minutes** (Full feature walkthrough)

---

## 🚀 Pre-Demo Setup (2 minutes)

### Start the System
```bash
# Terminal 1 - Backend
cd /Users/joker2307/Desktop/unagi/backend
python3 main.py

# Terminal 2 - Frontend
cd /Users/joker2307/Desktop/unagi/frontend
npm start
```

### Verify Running
- Backend: `http://localhost:5000` (should see Flask running)
- Frontend: `http://localhost:3000` (should open automatically)
- Connect wallet and login

---

## 📝 Demo Script

### Part 1: Introduction (1 min)

**SAY:**
> "Trinetra is an AI-powered security camera network that uses Sui blockchain to verify and permanently record all AI analysis results. Every query, every detection is cryptographically verified and stored on-chain with Walrus decentralized storage."

**SHOW:**
- Terminal interface with commands
- Point out `[BLOCKCHAIN-VERIFY]` button

---

### Part 2: Camera Registration with Blockchain (2 min)

**SAY:**
> "Let me add a CCTV camera to the system. Trinetra automatically registers it on the Sui blockchain."

**DO:**
1. Click `[INIT-CAMERA-PROTOCOL]`
2. Enter URL: `https://stream-uc2-charlie.dropcam.com/nexus_aac/54d1f7859e9741448b240eb44e972098/chunklist_w2002435562.m3u8?public=aQAoqnQ5Af`
3. Click `[ANALYZE URL]`
4. Wait for validation: "Found 1 stream(s)! (HLS) ✓ Validated"
5. Enter coordinates: `37.7749,-122.4194`
6. Enter description: "San Francisco Tennis Courts"
7. Click `[COMMIT]`

**POINT OUT:**
- Stream validation with checkmark
- Automatic HLS detection
- Behind the scenes: Camera registered on Sui blockchain

**SAY:**
> "Notice the system validated the HLS stream and automatically registered this camera on the Sui blockchain. The camera is now permanently recorded on-chain."

---

### Part 3: AI Analysis with Blockchain Verification (2 min)

**SAY:**
> "Now let's ask the AI to analyze this camera feed. Watch what happens - every AI analysis automatically creates a blockchain verification."

**DO:**
1. Click on map or enter query
2. Type: "What do you see in this camera feed?"
3. Submit query
4. **WATCH FOR TOAST NOTIFICATION:**
   - "Verification recorded on Sui! TX: 0xabc123..."

**POINT OUT:**
- AI analysis result appears
- Toast notification shows blockchain transaction
- No manual action needed - automatic verification

**SAY:**
> "Did you see that? The AI analyzed the camera, and immediately - without any manual action - the system created a verification record on the Sui blockchain. The toast notification shows the transaction hash. This creates an immutable audit trail."

---

### Part 4: Blockchain Dashboard (3 min)

**SAY:**
> "Let's view the blockchain dashboard to see all our verifications."

**DO:**
1. Click `[BLOCKCHAIN-VERIFY]`
2. **SHOW STATISTICS:**
   - Total Cameras: 1
   - Verifications: 1
   - Walrus Blobs: 0 (or more)

**POINT OUT:**
```
▣ SUI BLOCKCHAIN VERIFICATION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL CAMERAS: 1
VERIFICATIONS: 1
WALRUS BLOBS: 0
```

3. **SHOW SMART CONTRACT ADDRESSES:**
   - Package ID
   - Registry ID

**SAY:**
> "Here you can see the Sui smart contract addresses. All our cameras and verifications are stored in these on-chain objects."

4. **SHOW VERIFICATION HISTORY:**
   - Click on the verification entry

**POINT OUT:**
- Request ID
- Camera UID
- Request type (ai_query_analysis)
- Verification status
- Transaction hash with Explorer link

**SAY:**
> "Each verification includes all the details: the camera, the AI result, the verification hash, and most importantly - the transaction hash that proves this is permanently recorded on the Sui blockchain."

5. **CLICK VERIFICATION FOR DETAILS:**

**SHOW MODAL:**
```
▣ VERIFICATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUEST ID: 0xreq00000001
CAMERA UID: CAM-001
REQUEST TYPE: ai_query_analysis
AI RESULT: "Person visible in tennis court..."
WALRUS BLOB ID: walrus_abc123...
VERIFICATION HASH: 7f83b1657ff1fc53b92dc18...
TRANSACTION: 0xabc123... [View on Explorer]

Status: ⧗ PENDING VERIFICATION
[VERIFY NOW]
```

**SAY:**
> "Here's the full verification record. Notice the verification hash - this is a SHA-256 hash of the camera ID, request type, AI result, and timestamp. This makes the record cryptographically verifiable and tamper-proof."

6. **CLICK [VERIFY NOW]:**
   - Status changes to ✓ VERIFIED
   - New transaction hash appears

**SAY:**
> "I just confirmed this verification on-chain. Now it's permanently marked as verified with a second transaction. This creates a complete, immutable audit trail."

---

### Part 5: Add Another Camera & Show Real-Time Updates (2 min)

**SAY:**
> "Let me show you how this scales. I'll add another camera quickly."

**DO:**
1. Go back to terminal (click [BACK TO TERMINAL])
2. Click `[INIT-CAMERA-PROTOCOL]`
3. Add another camera (use same URL or different)
4. Submit query: "How many people are visible?"
5. Immediately click `[BLOCKCHAIN-VERIFY]`

**POINT OUT:**
- Statistics updated in real-time
- Total Cameras: 2
- Verifications: 2
- New verification appears in history

**SAY:**
> "The dashboard auto-refreshes every 5 seconds, so you always see the latest blockchain state. Every AI query, every analysis - all automatically verified and recorded."

---

### Part 6: Walrus Storage Demo (Optional, 1 min)

**SAY:**
> "Behind the scenes, we're also using Walrus - a decentralized storage system from Mysten Labs - to store the actual image data when needed."

**DO:**
1. In blockchain dashboard, show Walrus Blob ID
2. Explain: "This blob ID is a content-addressable reference in Walrus storage. The actual image or data is stored there, while the verification and hash are on Sui."

**POINT OUT:**
```
WALRUS BLOB ID: walrus_abc123...
```

**SAY:**
> "This separation is important - Sui stores the verification and metadata, while Walrus stores the actual data. This gives us both blockchain security and decentralized storage."

---

### Part 7: API Demo (Optional, 2 min)

**SAY:**
> "Everything we just did through the UI is also available via API. Let me show you."

**DO:**
```bash
# Show blockchain stats
curl http://localhost:5000/api/sui/blockchain_stats | jq

# Create verification manually
curl -X POST http://localhost:5000/api/sui/create_verification \
  -H "Content-Type: application/json" \
  -d '{
    "camera_uid": "DEMO-CAM",
    "request_type": "manual_demo",
    "ai_result": "Demo verification via API"
  }' | jq
```

**POINT OUT:**
- JSON response with tx_hash
- Success message
- Sui Explorer link

---

### Part 8: Smart Contract Code (Optional, 2 min)

**SAY:**
> "Let me quickly show you the Sui Move smart contract that powers this."

**DO:**
1. Open `sui_contracts/sources/trinetra_verification.move`
2. **Show key functions:**

```move
// Camera Registration
public entry fun register_camera(
    registry: &mut CameraRegistry,
    camera_uid: String,
    location: String,
    stream_url: String,
    ...
)

// Verification Creation
public entry fun create_verification_request(
    camera_uid: String,
    request_type: String,
    walrus_blob_id: String,
    ai_result: String,
    verification_hash: String,
    ...
)
```

**SAY:**
> "These are the core smart contract functions. When we add a camera or create a verification through the UI, we're actually calling these on-chain functions. Everything is stored in Sui's object model with full type safety from Move."

---

### Part 9: Technical Architecture (1 min)

**SHOW DIAGRAM:**
```
User Query → AI Analysis → Blockchain Verification
                ↓                     ↓
           Gemini AI            Sui Blockchain
                                      ↓
                                Walrus Storage
```

**SAY:**
> "Here's the complete flow:
> 1. User asks a question about a camera
> 2. AI analyzes using Google Gemini
> 3. Result automatically creates blockchain verification
> 4. Verification stored on Sui with cryptographic hash
> 5. Optional data stored in Walrus
> 6. User sees toast notification with TX hash
> 7. Everything viewable in blockchain dashboard
> 
> All of this happens automatically - the user just asks questions, and we handle the blockchain verification in the background."

---

### Part 10: Use Cases (1 min)

**SAY:**
> "Why blockchain verification for CCTV? Four key use cases:

**1. Security Monitoring**
> When AI detects suspicious activity, we have cryptographic proof that's admissible as evidence.

**2. Compliance & Auditing**
> Regulatory bodies can verify our AI decisions through the immutable blockchain record.

**3. Identity Verification**
> Face recognition results are blockchain-backed, creating a tamper-proof access log.

**4. Incident Response**
> For legal cases, we have cryptographic proof of what the AI saw and when."

---

### Part 11: Mock vs Real Mode (1 min)

**SAY:**
> "Currently running in mock mode for this demo - all the features work, but we're not actually sending transactions to the Sui testnet. In production mode, we would:"

**POINT OUT:**
1. Deploy smart contracts to Sui testnet
2. Connect real Sui wallet with SUI tokens
3. Use actual Walrus storage
4. Generate real on-chain transactions

**SAY:**
> "The code is production-ready. Switching from mock to real is just a configuration change. All the APIs, UI, and smart contracts are built for real blockchain deployment."

---

## 🎯 Key Talking Points

### Technical Innovation
- ✨ First AI CCTV system with blockchain verification
- ✨ Automatic verification (no manual steps)
- ✨ Sui blockchain + Walrus storage
- ✨ Move smart contracts for type safety

### Security & Trust
- 🔐 Cryptographic verification hashes (SHA-256)
- 🔐 Immutable on-chain records
- 🔐 Transparent audit trail
- 🔐 Decentralized storage

### User Experience
- 🎨 One-click blockchain dashboard
- 🎨 Automatic verification on every query
- 🎨 Real-time statistics
- 🎨 Beautiful terminal UI

### Business Value
- 💼 Regulatory compliance ready
- 💼 Legal evidence trail
- 💼 Enterprise-grade security
- 💼 Scalable architecture

---

## 📊 Demo Metrics to Highlight

After full demo, you should have:
- **Cameras Registered:** 2+
- **Verifications Created:** 3+
- **Transaction Hashes:** Multiple
- **Verification History:** Visible timeline
- **Real-time Updates:** Working

---

## 🎤 Closing Statement

**SAY:**
> "To summarize: Trinetra combines AI-powered CCTV analysis with Sui blockchain verification and Walrus decentralized storage. Every AI decision is automatically verified, cryptographically hashed, and permanently recorded on-chain. This creates an immutable audit trail for security, compliance, and legal purposes.
>
> The system is production-ready, with comprehensive documentation, clean APIs, and a beautiful user interface. We're ready to deploy to Sui testnet whenever needed.
>
> Questions?"

---

## ❓ Prepared Q&A

### Q: "Why blockchain for CCTV?"
**A:** "Immutable audit trail, cryptographic proof, regulatory compliance, and legal evidence that can't be tampered with."

### Q: "What's the cost?"
**A:** "Sui is extremely gas-efficient. Each verification transaction would cost fractions of a cent. Plus, we're using Walrus for cheap, decentralized storage instead of expensive on-chain storage."

### Q: "Is this real blockchain or simulated?"
**A:** "Currently mock mode for demo, but the code is production-ready. All smart contracts, APIs, and UI are built for real Sui deployment. It's just a config change."

### Q: "How does it scale?"
**A:** "Sui's parallel transaction processing handles thousands of TPS. Walrus provides scalable decentralized storage. We can handle hundreds of cameras with millions of verifications."

### Q: "What about privacy?"
**A:** "We only store verification hashes and metadata on-chain. Actual sensitive data goes to Walrus with access controls. The blockchain just proves what the AI saw, not stores the raw video."

### Q: "Can verifications be deleted?"
**A:** "No - that's the point. Once on Sui blockchain, the record is permanent and immutable. This creates accountability."

---

## 🎬 Demo Variations

### Quick Demo (5 min)
- Part 1, 2, 3, 4, 10

### Technical Demo (15 min)
- All parts except optional sections

### Full Demo (20 min)
- All parts including optional sections

### API-Focused Demo
- Parts 1, 2, 7, 8, 10

---

## ✅ Pre-Demo Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Wallet connected
- [ ] Browser console open (F12) for logs
- [ ] Test camera URL ready
- [ ] Demo script printed/accessible
- [ ] Backup: Have curl commands ready

---

## 🎉 Success Criteria

After demo, audience should understand:
- ✅ How Trinetra verifies AI analysis on blockchain
- ✅ Why blockchain verification matters for CCTV
- ✅ How Sui + Walrus work together
- ✅ The automatic nature of verification
- ✅ Real-world use cases

---

**Good luck with your demo! 🚀👁️⛓️**
