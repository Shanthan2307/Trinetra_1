# ⚡ Trinetra Blockchain - Quick Start

## 🚀 Start the System (3 Commands)

### 1. Start Backend
```bash
cd /Users/joker2307/Desktop/unagi/backend
python3 main.py
```

### 2. Start Frontend (New Terminal)
```bash
cd /Users/joker2307/Desktop/unagi/frontend
npm start
```

### 3. Open Browser
```
http://localhost:3000
```

---

## 📋 Test Blockchain Integration (5 Steps)

### Step 1: Connect Wallet
- Click `[CONNECT WALLET]`
- Login with Sui wallet

### Step 2: Add a Camera
- Click `[INIT-CAMERA-PROTOCOL]`
- Enter camera URL: `https://stream.example.com/camera.m3u8`
- Click `[ANALYZE URL]`
- Enter coordinates: `37.7749,-122.4194`
- Click `[COMMIT]`
- **✅ Camera automatically registered on Sui blockchain!**

### Step 3: Ask AI a Question
- Enter query: "What do you see in this camera?"
- Click on map or camera marker
- AI analyzes and responds
- **✅ Verification automatically recorded on Sui blockchain!**
- Toast notification shows: `Verification recorded on Sui! TX: 0xabc123...`

### Step 4: View Blockchain Dashboard
- Click `[BLOCKCHAIN-VERIFY]` button
- See statistics:
  - Total Cameras: 1
  - Verifications: 1
  - Walrus Blobs: 1
- View recent verifications with transaction hashes
- Click any verification to see full details

### Step 5: Confirm Verification
- In blockchain dashboard, click a pending verification
- Click `[VERIFY NOW]` button
- **✅ Verification confirmed on-chain!**
- Status changes to `✓ VERIFIED`

---

## 🎯 What Just Happened?

1. **Camera Registration** → Recorded on Sui blockchain with on-chain proof
2. **AI Analysis** → AI processed camera data using Gemini
3. **Blockchain Verification** → Result stored with cryptographic hash
4. **Walrus Storage** → Data stored in decentralized storage
5. **Transaction Hash** → Immutable proof on Sui blockchain
6. **Explorer Link** → View transaction on Sui Explorer

---

## 🔍 Verify It Works

### Check Backend Logs
```bash
# You should see:
✓ Direct stream URL detected! Type: HLS
✓ Valid .m3u8 playlist found
Creating blockchain verification: CAM-001 ...
✅ Blockchain verification created
```

### Check Browser Console (F12)
```javascript
// You should see:
Creating blockchain verification: CAM-001 ...
✅ Blockchain verification created: {
  success: true,
  tx_hash: "0x...",
  request_id: "0xreq00000001"
}
```

### Check Blockchain Dashboard
- Total Cameras should increment
- Total Verifications should increment
- Recent Verifications should show new entry

---

## 📊 API Test (Optional)

### Test Camera Registration
```bash
curl -X POST http://localhost:5000/api/sui/register_camera \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "TEST-001",
    "location": "37.7749,-122.4194",
    "stream_url": "https://test.com/stream.m3u8"
  }'
```

### Test Verification Creation
```bash
curl -X POST http://localhost:5000/api/sui/create_verification \
  -H "Content-Type: application/json" \
  -d '{
    "camera_uid": "TEST-001",
    "request_type": "manual_test",
    "ai_result": "Test verification from API"
  }'
```

### Get Blockchain Stats
```bash
curl http://localhost:5000/api/sui/blockchain_stats
```

---

## 🎮 Features Demo

### Feature 1: Automatic Blockchain Verification
- **Every AI query automatically creates blockchain verification**
- No manual action needed
- Transaction hash shown in toast notification

### Feature 2: Verification Dashboard
- Real-time blockchain statistics
- Verification history with details
- Transaction explorer integration
- One-click verification confirmation

### Feature 3: Walrus Storage
- Images/data stored in Walrus
- Blob IDs tracked on-chain
- Decentralized and permanent

### Feature 4: Smart Contract Events
- Every action emits blockchain event
- Transparent and auditable
- Immutable record

---

## 🎨 UI Elements

### Terminal Commands
```
[INIT-CAMERA-PROTOCOL]  → Register camera (auto blockchain)
[BLOCKCHAIN-VERIFY]     → View blockchain dashboard
[OPEN-CCTV]            → View camera streams
[GET-UPDATES]          → Check system updates
```

### Blockchain Dashboard
```
▣ SUI BLOCKCHAIN VERIFICATION SYSTEM

┌─────────────────────────────────────┐
│ TOTAL CAMERAS         │ 5           │
│ VERIFICATIONS         │ 23          │
│ WALRUS BLOBS          │ 15          │
└─────────────────────────────────────┘

Recent Verifications:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request ID: 0xreq00000001
Camera: CAM-001
Type: ai_query_analysis
Status: ✓ VERIFIED
TX: 0xabc123... [View on Explorer]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔐 Security Features

### Verification Hash
Each verification includes SHA-256 hash:
```
Hash = SHA256(camera_uid + request_type + ai_result + timestamp)
```

### Transaction Proof
- Sui transaction hash for each action
- Link to Sui Explorer for verification
- Immutable on-chain record

### Walrus Storage
- Decentralized data storage
- Content-addressable (blob ID)
- Permanent availability

---

## 🐛 Troubleshooting

### Issue: "Module not found: sui_integration"
```bash
# Make sure sui_integration.py exists in backend/
ls backend/sui_integration.py

# Restart backend
cd backend
python3 main.py
```

### Issue: "Blockchain dashboard shows 0 verifications"
```bash
# Test API directly
curl http://localhost:5000/api/sui/blockchain_stats

# Should return JSON with stats
# If empty, try creating a test verification
```

### Issue: "Toast notification not showing"
```bash
# Check browser console (F12)
# Should see: "Creating blockchain verification..."
# If not, check network tab for API calls
```

---

## 📈 Expected Results

### After Adding 1 Camera
```json
{
  "total_cameras": 1,
  "total_verifications": 0,
  "walrus_blobs": 0
}
```

### After 1 AI Query
```json
{
  "total_cameras": 1,
  "total_verifications": 1,
  "walrus_blobs": 0,
  "recent_verifications": [
    {
      "request_id": "0xreq00000001",
      "camera_uid": "CAM-001",
      "verified": false,
      "tx_hash": "0x..."
    }
  ]
}
```

### After Confirming Verification
```json
{
  "verified": true,
  "tx_hash": "0x... (new confirmation tx)"
}
```

---

## 🎉 Success Indicators

✅ **Backend Console:**
- `Creating blockchain verification: ...`
- `✅ Blockchain verification created`

✅ **Frontend:**
- Toast: `Verification recorded on Sui! TX: 0x...`
- Dashboard shows updated counts
- Verification appears in history

✅ **API Response:**
```json
{
  "success": true,
  "request_id": "0xreq00000001",
  "tx_hash": "0x...",
  "sui_explorer": "https://suiexplorer.com/..."
}
```

---

## 🚀 Next Steps

1. **Test with real CCTV stream** - Use actual .m3u8 URL
2. **Ask multiple queries** - Build verification history
3. **Confirm verifications** - Test on-chain confirmation
4. **Check transaction links** - View on Sui Explorer (mock)
5. **Monitor statistics** - Watch real-time updates

---

## 📚 More Info

- Full docs: `SUI_BLOCKCHAIN_INTEGRATION.md`
- CCTV setup: `CCTV_M3U8_FIX.md`
- Quick start: `QUICK_START_CCTV.md`

---

**Your Trinetra system now has blockchain-verified AI analysis!** ⛓️🎥✨
